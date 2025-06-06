import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    UsersService,
    UsersResolver,
    CustomLogger,
    ConfigService
  ],
  exports: [UsersService]
})
export class UsersModule {}
