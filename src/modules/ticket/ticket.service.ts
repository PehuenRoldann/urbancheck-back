import { Injectable } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { PrismaService } from '@modules/prisma/prisma.service';
import { User } from '@modules/entities/user.entity';
import { priority_level_enum, role_enum, ticket_status_enum } from '@prisma/client';
import { ForbiddenError } from 'apollo-server-express';
import { Ticket } from '@modules/entities/ticket.entity';
import { TicketFilterInput } from './dto/filter-ticket.input';
import { UsersService } from '@modules/users/users.service';
import { TicketStatusService } from '@modules/ticket-status/ticket-status.service';
import { DependencyService } from '@modules/dependency/dependency.service';
import { RoleLabels, TicketStatusLabels } from '@modules/utils/mappers';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { StatusHistory } from '@modules/entities/status_history.entity';
import { TicketStatus } from '@modules/entities/ticket_status.entity';
import { PriorityHistory } from '@modules/entities/priority_history.entity';
import { Priority } from '@modules/entities/priority.entity';
import { SubscriptionsService } from '@modules/subscriptions/subscriptions.service';

@Injectable()
export class TicketService {
  

  constructor (
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly ticketStatusService: TicketStatusService,
    private readonly dependencyService: DependencyService,
    private readonly logger: CustomLogger,
    private readonly subscriptionService: SubscriptionsService,
  ) {}

  async create(input: CreateTicketInput, user: User): Promise<Ticket> {

    this.logger.log(`TicketService - create - parameteres: ${JSON.stringify(input)} user: ${JSON.stringify(user)}`);

  
    if (!user || !user.id) {
      throw new ForbiddenError('TicketService - create - invalid user');
    }
    const status = user.role.description === RoleLabels[role_enum.ciudadano]
      ? ticket_status_enum.Pendiente
      : ticket_status_enum.V_lido;
  
    const statusRecord = await this.prisma.ticket_status.findFirst({
      select: { id: true },
      where: { description: status }
    });
  
    if (!statusRecord) {
      throw new ForbiddenError(`TicketService - create - invalid status: ${status}`);
    }
  
    const priorityDefault = await this.prisma.priority.findFirst({
      where: { description: priority_level_enum.Baja }
    });
  
    if (!priorityDefault && !input.priorityId) {
      throw new ForbiddenError(`TicketService - create - no default priority found`);
    }
  
    const [createdTicket] = await this.prisma.$transaction([
      this.prisma.ticket.create({
        data: {
          description: input.description,
          latitude: input.latitude,
          longitude: input.longitude,
          timestamp: new Date(),
          image_url: input.imageUrl,
          issue: { connect: { id: input.issueId! } },
        }
      }),
      // Los siguientes se ejecutarán dentro de la transacción usando luego el createdTicket.id
    ]);
  
    await this.prisma.$transaction([
      this.prisma.status_history.create({
        data: {
          ticket_id: createdTicket.id,
          status_id: statusRecord.id,
          author_id: user.id
        }
      }),
      this.prisma.priority_history.create({
        data: {
          author_id: user.id,
          ticket_id: createdTicket.id,
          priority_id: input.priorityId ?? priorityDefault?.id
        }
      })
    ]);

    const subscription = await this.subscriptionService.createSubscription({
      ticketId: createdTicket.id
    }, user);
  
    const fullTicket = await this.prisma.ticket.findFirst({
      where: { id: createdTicket.id },
      include: {
        issue: true,
        subscription: true,
        status_history: true,
        priority_history: true,
      }
    });
  
    if (!fullTicket) {
      throw new ForbiddenError(`TicketService - create - failed to retrieve created ticket`);
    }
  
    return fullTicket as unknown as Ticket;
  }

  findAll() {
    return `This action returns all ticket`;
  }

  async findOne(id: string, fields: any) {

    try {

      const ticket_db = await this.prisma.ticket.findFirst({
        where: {id: id},
        include: {
          status_history: true,
          priority_history: true,
          subscription: true,
          issue: true,
        }
      });

      const ticket_data =  ticket_db as unknown as Ticket;

      if (fields.current_status) {
        let last_status_history: StatusHistory;

        await this.prisma.status_history.findFirst({
          where: {ticket_id: id},
          orderBy: {its: 'desc'},
        }).then((status_history) => {
          last_status_history = status_history as StatusHistory;
        });

        await this.prisma.ticket_status.findFirst({
          where: {id: last_status_history!.status_id ?? -1}
        }).then((status) => {
          ticket_data.current_status = status as TicketStatus as any;
          if (ticket_data.current_status?.description === ticket_status_enum.V_lido) {
            ticket_data.current_status.description = TicketStatusLabels[ticket_status_enum.V_lido];
          }
        });
      }

      if (fields.current_priority) {

        let last_priority_history: PriorityHistory;

        await this.prisma.priority_history.findFirst({
          where: {ticket_id: id},
          orderBy: {its: 'desc'},
          include: {priority: true}
        }).then((priority_history) => {
          last_priority_history = priority_history as unknown as PriorityHistory;
        });

        ticket_data.current_priority = last_priority_history!.priority as unknown as Priority;

        if (ticket_data.current_priority.description === priority_level_enum.Muy_Alta) ticket_data.current_priority.description = 'Muy Alta';
      }

      if (fields.author) {
        const author = await this.usersService.findAuthor(ticket_data.id);
        ticket_data.author = author ?? undefined;
      }

      return ticket_data;
      

    } catch (error) {
      throw error;
    }
    

  }

async update(input: UpdateTicketInput, fields: any, user: User) {
  this.logger.log(
    `TicketService - update - id: ${input.id} input: ${JSON.stringify(input)} fields: ${JSON.stringify(fields)}`
  );


  try {
    await this.prisma.$transaction(
      async (tx) => {
        // 1) Actualizar ticket (usá el cliente tx, y await)
        await tx.ticket.update({
          where: { id: input.id },
          data: {
            ...(input.scheduledResolutionAt != null && {
              scheduled_resolution_at: input.scheduledResolutionAt,
            }),
          },
        });

        // 2) Status history (condicional y con await)
        if (input.statusId !== undefined && input.statusId !== null) {
          await tx.status_history.create({
            data: {
              ticket_id: input.id,
              status_id: input.statusId,
              author_id: user?.id ?? null, // ojo con null/constraint
            },
          });
        }

        // 3) Priority history (condicional y con await)
        if (input.priorityId !== undefined && input.priorityId !== null) {
          await tx.priority_history.create({
            data: {
              ticket_id: input.id,
              priority_id: input.priorityId,
              author_id: user?.id ?? null,
            },
          });
        }

        // 4) Issue (condicional y con await)
        if (input.issueId !== undefined && input.issueId !== null) {
          await tx.ticket.update({
            where: { id: input.id },
            data: {
              issue: { connect: { id: input.issueId } },
            },
          });
        }
      },
      {
        // opcional
        timeout: 15_000,
        // isolationLevel: 'Serializable', // según DB/need
      }
    );
  } catch (error: any) {
    this.logger.error(`TicketService - update - error: ${error.message}`, error.stack);
    throw error;
  }


  if (input.statusId != null) {
    const status = await this.ticketStatusService.findTicketStatusById(input.statusId);
    this.subscriptionService.notifyStatusChange(
      input.id,
      status!.description
    );
  }



  // luego de commit, devolvés el ticket actualizado
  return this.findOne(input.id, fields);
}

  remove(id: string) {
    return `This action removes a #${id} ticket`;
  }


  async findFiltered(
  filter: TicketFilterInput | undefined = undefined,
  include_author: boolean = false,
  include_current_status: boolean = false,
  include_dependency: boolean = false,
): Promise<Ticket[]> {
  try {
    const where: any = {};

    if (filter?.user_id) {
      where.subscription = { some: { user_id: filter.user_id } };
    }

    // ticket -> issue (1:1) -> dependency
    if (filter?.dependency_id) {
      where.issue = { is: { dependency_id: filter.dependency_id } };
    }

    if (filter?.ticket_id) {
      where.id = filter.ticket_id;
    }

    const baseInclude = {
      // incluimos dependency dentro de issue si lo pidieron, así evitamos N+1
      issue: include_dependency ? { include: { dependency: true } } : true,
      subscription: true,
      status_history: {
        orderBy: { its: 'asc' },
        include: { ticket_status: true }, // para poder devolver current_status sin otra query
      },
      priority_history: {
        orderBy: { its: 'asc' },
      },
    } as const;

    // Traemos los tickets que cumplen los filtros “directos”
    // (status/priority se aplican luego por post-filtro sobre el último historial)
    let tickets = await this.prisma.ticket.findMany({
      where,
      include: baseInclude,
      orderBy: { its: 'desc' },
    });

    // Post-filtro: último status/priority
    if (filter?.status_id || filter?.priority_id) {
      tickets = tickets.filter((t) => {
        const lastStatus = t.status_history?.length
          ? t.status_history[t.status_history.length - 1]
          : undefined;
        const lastPriority = t.priority_history?.length
          ? t.priority_history[t.priority_history.length - 1]
          : undefined;

        if (filter?.status_id && (!lastStatus || lastStatus.status_id !== filter.status_id)) {
          return false;
        }
        if (filter?.priority_id && (!lastPriority || lastPriority.priority_id !== filter.priority_id)) {
          return false;
        }
        return true;
      });
    }

    // Paginación (sobre el resultado ya post-filtrado para que sea consistente)
    if (filter?.page !== undefined) {
      if (filter.limit === undefined) {
        throw Error('TicketService - findFiltered - There is no given limit for pagination!');
      }
      const page = filter.page!;
      const limit = filter.limit!;
      const skip = (page - 1) * limit;
      tickets = tickets.slice(skip, skip + limit);
    }

    // Enriquecimientos opcionales
    if (include_author) {
      tickets = await Promise.all(
        tickets.map(async (ticket) => {
          const author = await this.usersService.findAuthor(ticket.id);
          return { ...ticket, author: author ?? undefined };
        })
      );
    }

    if (include_current_status) {
      tickets = tickets.map((ticket) => {
        const last = ticket.status_history?.length
          ? ticket.status_history[ticket.status_history.length - 1]
          : undefined;
        const current_status = last?.ticket_status ?? undefined;
        return { ...ticket, current_status };
      });
    }

    if (include_dependency) {
      tickets = tickets.map((ticket) => {
        const dependency = (ticket as any).issue?.dependency ?? undefined;
        return { ...ticket, dependency };
      });
    }

    return tickets as unknown as Ticket[];
  } catch (error: any) {
    this.logger.error(`TicketService - findFiltered - error: ${error.message}`, error);
    return [];
  }
}

  
  async countFiltered(filter?: TicketFilterInput): Promise<number> {
    
    const where: any = {};

    if (filter?.user_id) {
      where.subscription = {
        some: { user_id: filter.user_id }
      };
    }
  
    if (filter?.status_id) {
      where.status_history = {
        some: { status_id: filter.status_id }
      };
    }
  
    if (filter?.priority_id) {
      where.priority_history = {
        some: { priority_id: filter.priority_id }
      };
    }
  
    if (filter?.dependency_id) {
      where.issue = {
        dependency_id: filter.dependency_id
      };
    }

    return this.prisma.ticket.count({
      where,
    });

  }
}
