import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class KeycloakProfileGuard implements CanActivate {
  constructor(private readonly logger: CustomLogger) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req; 
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.error(
        `KeycloakProfileGuard - Falta token de autenticación - ${req.body}`,
      );
      throw new UnauthorizedException('Falta el token de autenticación');
    }

    const token = authHeader.split(' ')[1];

    const keycloakBaseUrl = process.env.KEYCLOAK_BASE_URL;
    const realm = process.env.KEYCLOAK_REALM;
    const userinfoEndpoint = `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/userinfo`;

    const response = await fetch(userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      this.logger.error(`KeycloakProfileGuard - Token Inválido - ${req.body}`);
      throw new UnauthorizedException('Token inválido');
    }

    const profile = await response.json();
    (req as any).keycloakProfile = profile;

    this.logger.log(`KeycloakProfileGuard - Token Válido - ${req.body}`);
    return true;
  }
}
