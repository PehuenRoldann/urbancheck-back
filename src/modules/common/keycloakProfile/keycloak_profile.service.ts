// src/modules/keycloak/keycloak.service.ts
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@modules/entities/user.entity';
import { UserRoles } from '@modules/enum/enums';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Role } from '@modules/entities/role.entity';
import { CustomLogger } from '../logger/logger.service';
import { CreateUserInput } from '@modules/users/dto/user.input';
import { role_enum } from '@prisma/client';

@Injectable()
export class KeycloakService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger
  ) {}

  async mapKeycloakProfileToUser(profile: any): Promise<any> {

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

    const userData: CreateUserInput = {
      authProviderId: profile.sub,
      email: profile.email,
      dni: profile.dni,
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate ? new Date(profile.birthDate) : new Date(),
      postalCode: profile.postalCode
        ? parseInt(profile.postalCode)
        : null,
      street: profile.street ?? null,
      streetNumber: profile.streetNumber
        ? parseInt(profile.streetNumber)
        : null,
      roleId:   roleData.id,
    };

    return userData;
  }
}
