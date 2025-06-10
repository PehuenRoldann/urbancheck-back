import {
  Resolver,
  Query,
  Args,
  createUnionType,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { User } from '@modules/entities/user.entity';
import { ErrorResponse } from '@modules/common/graphql/error.model';
import { UsersService } from '@modules/users/users.service';
import { CustomLogger } from '@modules/common/logger/logger.service';
import {
  LazySyncUserInput,
} from '@modules/users/dto/user.input';
import { UseGuards } from '@nestjs/common';
import { KeycloakProfileGuard } from '@modules/common/keycloakProfile/keycloak_profile.guard';
import { KeycloakService } from '@modules/common/keycloakProfile/keycloak_profile.service';

export const UserResult = createUnionType({
  name: 'UserResult',
  types: () => [User, ErrorResponse] as const,
  resolveType(value) {
    if ('email' in value) return User;
    if ('code' in value) return ErrorResponse;
    return null;
  },
});

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly keycloakService: KeycloakService,
    private readonly logger: CustomLogger,
  ) {}

  @Query(() => [User])
  async findAll(): Promise<User[]> {
    return await this.usersService.FindAll();
  }

  @Query(() => UserResult, { name: 'user' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User | ErrorResponse> {
    const userData = await this.usersService.findOne(id);

    if (userData) {
      return userData;
    }

    this.logger.warn(
      `UsersResolver - findOne - Usuario no encontrado con id: ${id}`,
    );
    return new ErrorResponse('Usuario no encontrado', '404', 'Users > FindOne');
  }

  @Mutation(() => UserResult)
  @UseGuards(KeycloakProfileGuard)
  async lazySyncUser(
    @Args('input') input: LazySyncUserInput,
    @Context('req') req: any,
  ): Promise<typeof UserResult> {
    try {
      const userProfile = req.keycloakProfile;

      if (userProfile.sub !== input.auth_provider_id) {
        this.logger.warn(
          `Intento de registrar usuario con ID que no coincide con token: ${input.auth_provider_id} !== ${userProfile.sub}`,
        );
        return new ErrorResponse(
          'El ID del proveedor de autenticación no coincide con el token',
          '401',
          'Users > create',
        );
      }

      const user = await this.keycloakService.mapKeycloakProfileToUser(userProfile);
      const resposne = await this.usersService.lazySync(user);
      return resposne;
    } catch (err) {
      this.logger.error(`UsersResolver - create - ${err}`);
      return new ErrorResponse(
        'No se pudo crear el usuario',
        '500',
        'Users > create',
      );
    }
  }

}
