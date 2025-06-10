import { Injectable } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { PrismaService } from '@modules/prisma/prisma.service';
import { User } from '@modules/entities/user.entity';
import { priority_level_enum, role_enum, ticket, ticket_status_enum } from '@prisma/client';
import { ForbiddenError } from 'apollo-server-express';
import { Ticket } from '@modules/entities/ticket.entity';

@Injectable()
export class TicketService {

  constructor (
    private readonly prisma: PrismaService,
  ) {}

  async create(input: CreateTicketInput, user: User): Promise<Ticket> {

    let status: ticket_status_enum;

    if (user.role.description === role_enum.Ciudadano) {
      status = ticket_status_enum.Pendiente;
    }
    else {
      status = ticket_status_enum.V_lido;
    }

    const statusId = await this.prisma.ticket_status.findFirst({
      select: {id: true},
      where: {description: status}
    });

    if (statusId === null) {
      throw new ForbiddenError(`TicketService - create - invalid status id: ${statusId}`)
    }
  
    const createdTicket = await this.prisma.ticket.create({
      data: {
        description: input.description,
        latitude: input.latitude,
        longitude: input.longitude,
        timestamp: new Date(),
        image_url: input.imageUrl,
        issue: { connect: { id: input.issueId! } },
      }
    });

    const status_history = await this.prisma.status_history.create({
      data: {
        ticket_id: createdTicket.id,
        status_id: statusId.id,
        author_id: user.id
      }
    });

    const priority = await this.prisma.priority.findFirst({
      where: {description: priority_level_enum.Baja}
    });

    const priority_history = await this.prisma.priority_history.create({
      data: {
        author_id: user.id,
        ticket_id: createdTicket.id,
        priority_id: input.priorityId ?? priority?.id,
      }
    })

    const newTicket = await this.prisma.ticket.findFirst({
      where: {id: createdTicket.id},
      include: {
        issue: true,
        subscription: true,
        status_history: true,
        priority_history: true,
      }
    })


    
    
    return newTicket as Ticket;
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: string) {
    return `This action returns a #${id} ticket`;
  }

  update(id: string, updateTicketInput: UpdateTicketInput) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: string) {
    return `This action removes a #${id} ticket`;
  }
}
