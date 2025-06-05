import { Resolver, Query, Args, Int, createUnionType } from '@nestjs/graphql';
import { User } from '../entities/users.model';
import { ErrorResponse } from '../common/graphql/error.model';

const usersMockData: User[] = [
    { id: 1, name: 'Juan', email: 'juan@example.com' },
    { id: 2, name: 'Ana', email: 'ana@example.com' },
  ];


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
  @Query(() => [User])
  findAll(): User[] {
    return usersMockData;
  }

  @Query(() => UserResult, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number): User | ErrorResponse {
    const userData = usersMockData.find((user) => user.id === id);

    if (userData){
        return userData;
    }
    
    return new ErrorResponse(
        'Usuario no encontrado',
        '404',
        'Users > FindOne'
    )
  }
}