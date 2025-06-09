import { User } from '@modules/users/entities/user.entity';

export class EntityMapperService {
  mapUserEntity(user: any): User {
    return {
      id: user.id,
      authProviderId: user.auth_provider_id,
      dni: Number(user.dni),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      birthDate: user.birth_date,
      postalCode: user.postal_code,
      street: user.street,
      streetNumber: user.street_number,
      roleId: user.role_id,
      its: user.its,
      uts: user.uts,
      dts: user.dts,
    };
  }
}
