import { Resolver, Query, Args, Int, createUnionType } from '@nestjs/graphql';
import { User } from '@modules/entities/users.model';
import { ErrorResponse } from '@modules/common/graphql/error.model';
import { UsersService } from '@modules/users/users.service';
import { CustomLogger } from '@modules/common/logger/logger.service';


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

  constructor (
    private readonly usersService: UsersService,
    private readonly logger: CustomLogger
  ) {}

  @Query(() => [User])
  async findAll(): Promise<User[]> {

    return await this.usersService.FindAll();
  }

  @Query(() => UserResult, { name: 'user' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<User | ErrorResponse> {
    const userData = await this.usersService.findOne(id);

    if (userData){
        return userData;
    }
    
    this.logger.warn(`UsersResolver - findOne - Usuario no encontrado con id: ${id}`)
    return new ErrorResponse(
        'Usuario no encontrado',
        '404',
        'Users > FindOne'
    )
  }
}