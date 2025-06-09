import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@modules/prisma/prisma.service';
import { EntityMapperService } from '@modules/utils/mapper/mapper.service';
import { KeycloakProfileGuard } from '@modules/common/keycloakProfile/keycloak_profile.guard';
import { KeycloakService } from '@modules/common/keycloakProfile/keycloak_profile.service';

@Module({
  providers: [
    UsersService,
    UsersResolver,
    CustomLogger,
    ConfigService,
    PrismaService,
    EntityMapperService,
    KeycloakProfileGuard,
    KeycloakService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
