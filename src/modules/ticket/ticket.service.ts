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


@Injectable()
export class TicketService {
  

  constructor (
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly ticketStatusService: TicketStatusService,
    private readonly dependencyService: DependencyService,
  ) {}

  async create(input: CreateTicketInput, user: User): Promise<Ticket> {
    const status = user.role.description === role_enum.Ciudadano
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

  async findOne(id: string) {

    try {

      const ticket_db = await this.prisma.ticket.findFirst({
        where: {id: id},
        include: {
          status_history: true,
          priority_history: true,
          subscription: true,
        }
      });

      return ticket_db as unknown as Ticket;

    } catch (error) {
      throw error;
    }
    

  }

  update(id: string, updateTicketInput: UpdateTicketInput) {
    return `This action updates a #${id} ticket`;
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

    let dataToReturn: Ticket[] = [];
    
    if (filter?.page === undefined) {
      const prismaTicket = await this.prisma.ticket.findMany({
        where,
        include: {
          issue: true,
          subscription: true,
          status_history: {
            include: {
              ticket_status: true
            }
          },
          priority_history: true,
        },
      });

      dataToReturn = prismaTicket as unknown as Ticket[];
    }
    else if (filter?.limit === undefined) {
      throw Error('TicketService - findFiltered - There is no given limit for pagination!');
    }
    else {
      const page = filter!.page!;
      const limit = filter!.limit!;

      const skip = (page - 1) * limit;

      const data = await this.prisma.ticket.findMany({
        where,
        include: {
          issue: true,
          subscription: true,
          status_history: true,
          priority_history: true,
        },
        skip,
        take: limit,
        orderBy: { its: 'desc' }
      });

      dataToReturn = data as unknown as Ticket[];
    }

    if (include_author) {
      dataToReturn = await Promise.all(
        dataToReturn.map(async (ticket) => {
          const author = await this.usersService.findAuthor(ticket.id);
          return { ...ticket, author: author ?? undefined };
        })
      );
    }

    if (include_current_status) {
      dataToReturn = await Promise.all(
        dataToReturn.map(async (ticket) => {
          const lastIndex = ticket.status_history.length - 1;
          const last_history = ticket.status_history[lastIndex];
          const current_status = await this.ticketStatusService.findTicketStatusById(last_history.status_id);
          return { ...ticket, current_status: current_status ?? undefined };
        })
      )
    }

    if (include_dependency) {
      dataToReturn = await Promise.all(
        dataToReturn.map(async (ticket) => {
          const dependency = await this.dependencyService.findOneById(ticket.issue!.id);
          return { ...ticket, dependency: dependency ?? undefined};
        })
      )
    }


    return dataToReturn;

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
