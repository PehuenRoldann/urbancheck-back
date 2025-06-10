import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@modules/entities/user.entity';
import { delay, NotFoundError } from 'rxjs';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateUserInput } from '@modules/users/dto/user.input';
import { EntityMapperService } from '@modules/utils/mapper/mapper.service';


@Injectable()
export class UsersService {
  constructor(
    private readonly logger: CustomLogger,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly entityMapper: EntityMapperService,
  ) {}

  async FindAll(): Promise<User[]> {
    this.logger.log('UsersService - FindAll');
    await delay(25000);
    return [];
  }

  async findOne(pId: string): Promise<User | undefined> {
    this.logger.log(`UsersService - FindOne - id: ${pId}`);
    await delay(2000);
    return new User();
  }

  async findByAuthId (pAuthId: string): Promise<User> {

    const user = await this.prisma.user_account.findFirst(
      {
        where: {auth_provider_id: pAuthId},
        include: {role: true}
      },
    );

    if (user) {
      return user as unknown as User;
    }

    throw new ForbiddenException(`UserService - findByAuthId - No se encuentra un usuario con authId: ${pAuthId}`);

  }

  async lazySync(data: CreateUserInput) {
    this.logger.log(`UserService - crate - with {
      authProviderId: ${data.authProviderId};
      dni: ${data.dni};
      email: ${data.email};
      firstName: ${data.firstName};
      lastName: ${data.lastName}
      }`);
    try {

      const user = await this.prisma.user_account.findFirst({
        where: {auth_provider_id: data.authProviderId},
        include:{
          role: true,
        }
      }) ?? null;

      if (user !== null) {
        
        this.logger.warn(`El usuario ya se encuentra sincronizado - 
          keycloakId: ${data.authProviderId}; 
          internalId: ${user.id};
          email: ${user.email}
          `);
        
        return user as unknown as User;
        
      }

      const [newUser] = await this.prisma.$transaction([
        this.prisma.user_account.create({
          data: {
            auth_provider_id: data.authProviderId,
            dni: data.dni,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            birth_date: data.birthDate,
            postal_code: data.postalCode,
            street: data.street,
            street_number: data.streetNumber,
            role: { connect: { id: data.roleId } },
          },
          include: {role: true},
        }),
      ]);

      const userToReturn: User = newUser as User;
      // return this.entityMapper.mapUserEntity(newUser);
      return userToReturn;
    } catch (err) {
      const error = err as Error;
      this.logger.error(`UserService - lazySync - message: ${error.message}`, error.stack ?? 'No stack available');
      throw err;
    }
  }


}
