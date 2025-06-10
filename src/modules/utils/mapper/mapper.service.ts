import { Ticket } from '@modules/entities/ticket.entity';
import { User } from '@modules/entities/user.entity';
import { issue, priority, ticket, ticket_status, user_account } from '@prisma/client';

export class EntityMapperService {
  mapUserEntity(user: any): User {
    /* return {
      id: user.id,
      auth_provider_id: user.auth_provider_id,
      dni: user.dni,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      birth_date: user.birth_date,
      postal_code: user.postal_code,
      street: user.street,
      street_number: user.street_number,
      role: user.role_id,
      its: user.its,
      uts: user.uts,
      dts: user.dts,
    }; */

    return new User();
  }


}

