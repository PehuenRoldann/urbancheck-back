// src/guards/keycloak-profile.module.ts
import { Module } from '@nestjs/common';
import { KeycloakProfileGuard } from '@modules/common/keycloakProfile/keycloak_profile.guard';
import { KeycloakService } from '@modules/common/keycloakProfile/keycloak_profile.service';
import { PrismaService } from '@modules/prisma/prisma.service';

@Module({
  providers: [KeycloakProfileGuard, KeycloakService, PrismaService],
  exports: [KeycloakProfileGuard, KeycloakService],
})
export class KeycloakProfileModule {}
