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

  @Query(() => UserResult)
  @UseGuards(KeycloakProfileGuard)
  async ticketAuthor (
    @Args('id', { type: () => String }) id: string,
  ): Promise<User | ErrorResponse> {

    try {
      const userData = await this.usersService.findAuthor(id);
      this.logger.log(`UsersResolver - return author with id: ${id}`);
      return userData;
    }
    catch(err) {
      const stack  = (err as Error).stack;
      const message = `UsersResolver - ticketAuthor - not found for ticket: ${id}`;
      this.logger.error(message, stack);
      return new ErrorResponse(message, '500', JSON.stringify(stack));
    }
  }

  @Query(() => UserResult, { name: 'user' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User | ErrorResponse> {
    const userData = await this.usersService.findOne(id);

    if (userData) {
      this.logger.log(`UsersResolver - return user data for id: ${id}`);
      return userData;
    }

    this.logger.warn(
      `UsersResolver - findOne - Usuario no encontrado con id: ${id}`,
    );
    return new ErrorResponse('Usuario no encontrado', '404', 'Users > FindOne');
  }

  @Query(() => UserResult)
  @UseGuards(KeycloakProfileGuard)
  async findOneByToken(
    @Context('req') req: any,
  ): Promise<User | ErrorResponse> {

    const userProfile = req.keycloakProfile;

    const userData = await this.usersService.findOne(userProfile.sub);

    if (userData) {
      this.logger.log(`UsersResolver - return user data for authentication id: ${userProfile.sub}`);
      return userData;
    }

    this.logger.warn(
      `UsersResolver - findOne - Usuario no encontrado con auth_provider_id: ${userProfile.sub}`,
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

      const userCreateInput = await this.keycloakService.mapKeycloakProfileToUser(userProfile);
      const resposne = await this.usersService.lazySync(userCreateInput);
      this.logger.log(`UsersResolver - usuario sincronizado correctamente - auth_id: ${userProfile.sub}; id: ${resposne.id}`);
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
