import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CustomLogger } from '@modules/common/logger/logger.service';

@Module({
  providers: [
    UsersService,
    UsersResolver,
    CustomLogger
  ],
  exports: [UsersService]
})
export class UsersModule {}
