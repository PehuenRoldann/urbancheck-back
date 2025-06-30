import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@modules/entities/user.entity';
import { delay, NotFoundError } from 'rxjs';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateUserInput } from '@modules/users/dto/user.input';
import { StatusHistory } from '@modules/entities/status_history.entity';
import { RoleLabels } from '@modules/utils/mappers';
import { role_enum } from '@prisma/client';


@Injectable()
export class UsersService {
  
  constructor(
    private readonly logger: CustomLogger,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}


  async findAuthor(pTicketId: string) {
    
    /* this.logger.log('UsersService - findAuthor - id: ' + pTicketId); */

    const statusHistory = await this.prisma.status_history.findMany({
      where: {
        ticket_id: pTicketId,
      },
      orderBy: {
        its: 'asc', // o 'desc' si querés los más recientes primero
      },
    });

    const firstStatus = statusHistory[0];

    if (!firstStatus) {
      this.logger.error(`UsersService - findAuthor - usuario no encontrado - id: ${pTicketId}`);
      throw new Error(`UsersService - findAuthor - usuario no encontrado - id: ${pTicketId}`);
    };

    const userDb = await this.prisma.user_account.findFirst({
      where: {id: firstStatus.author_id}
    });

    

    const userToReturn =  userDb as unknown as User;
    /* this.logger.log(`UsersService - findAuthor - found user: ${JSON.stringify(userToReturn)}`); */
    return userToReturn;
    
  }

  async FindAll(): Promise<User[]> {
    this.logger.log('UsersService - FindAll');
    await delay(25000);
    return [];
  }

  async findOne(pId: string): Promise<User | undefined> {
    
    const user_prisma = await this.prisma.user_account.findFirst({
      where: {auth_provider_id: pId},
      include: {
        role: true,
      }
    })

    if (user_prisma){
      const userToReturn =  user_prisma as unknown as User;

      userToReturn.role.description = RoleLabels[userToReturn.role.description as unknown as role_enum];
      return userToReturn;
    }

    throw new ForbiddenException (`UserService - findOne - user not found - id:${pId}`);
  }

  async findByAuthId (pAuthId: string): Promise<User> {

    const user = await this.prisma.user_account.findFirst(
      {
        where: {auth_provider_id: pAuthId},
        include: {role: true}
      },
    );

    if (user) {
      const userToReturn =  user as unknown as User;

      userToReturn.role.description = RoleLabels[userToReturn.role.description as unknown as role_enum];
      return userToReturn;
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
      return userToReturn;
    } catch (err) {
      const error = err as Error;
      this.logger.error(`UserService - lazySync - message: ${error.message}`, error.stack ?? 'No stack available');
      throw err;
    }
  }


}
