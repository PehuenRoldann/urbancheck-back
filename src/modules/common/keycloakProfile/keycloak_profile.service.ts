// src/modules/keycloak/keycloak.service.ts
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@modules/users/entities/user.entity';
import { UserRoles } from '@modules/enum/user_roles';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Role } from '@modules/entities/rol.model';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class KeycloakService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger
  ) {}

  async mapKeycloakProfileToUser(profile: any): Promise<User> {

    const realm_profile_roles = profile.realm_access.roles as Array<string>;
    const urbancheck_roles = Object.values(UserRoles);

    const profile_role_name = urbancheck_roles.find((role) => realm_profile_roles.includes(role));

    if (profile_role_name === undefined) {
      this.logger.error(`KeycloakService - El usuario no tiene un rol asignado - keycloakId: ${profile.sub}`);
      throw new ForbiddenException(`KeycloakService - El usuario no tiene un rol asignado - keycloakId: ${profile.sub}`);
    }

    const rolesFromDb = (await this.prisma.role.findMany()).map((r) => new Role(r.id, r.description));
    const roleData = rolesFromDb.find(x => x.description === profile_role_name);

    if (roleData === undefined) {
      this.logger.error(`KeycloakService - El usuario no tiene un rol válido - keycloakId: ${profile.sub}; rol: ${profile_role_name}`);
      throw new ForbiddenException(`KeycloakService - El usuario no tiene un rol válido -
        keycloakId: ${profile.sub}; rol: ${profile_role_name}`);
    }

    const user: User = {
      id: '',
      authProviderId: profile.sub,
      email: profile.email,
      dni: parseInt(profile.dni),
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: new Date(profile.birthDate),
      postalCode: profile.postalCode
        ? parseInt(profile.postalCode)
        : null,
      street: profile.street ?? null,
      streetNumber: profile.streetNumber
        ? parseInt(profile.streetNumber)
        : null,
      roleId:   roleData.id,
      its: new Date(),
      uts: null,
      dts: null,
    };

    return user;
  }
}
