import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.model';
import { delay } from 'rxjs';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

//------------ MOCK DATA --------------------
export const USERS_MOCK_DATA: User[] = [
    {
      id: '1',
      name: 'jdoe',
      email: 'jdoe@example.com',
      password: 'hashedpassword1',
      dni: 12345678,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01'),
      postalCode: 1000,
      street: 'Main St',
      streetNumber: 123,
    },
    {
      id: '2',
      name: 'mgarcia',
      email: 'mgarcia@example.com',
      password: 'hashedpassword2',
      dni: 23456789,
      firstName: 'Maria',
      lastName: 'García',
      birthDate: new Date('1985-07-15'),
      postalCode: 2000,
      street: 'Second Ave',
      streetNumber: 456,
    },
  ];



@Injectable()
export class UsersService {

    constructor (
        private readonly logger: CustomLogger,
        private readonly configService: ConfigService
    ) {}

    async FindAll (): Promise<User[]> {

        this.logger.log("UsersService - FindAll");
        await delay(25000);
        return USERS_MOCK_DATA;
    }


    async findOne (pId: string): Promise<User | undefined> {

        this.logger.log(`UsersService - FindOne - id: ${pId}`);
        await delay(2000);
        return USERS_MOCK_DATA.find((user) => user.id === pId);
    }
}
