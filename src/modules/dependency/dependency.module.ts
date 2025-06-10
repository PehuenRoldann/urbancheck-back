import { Module } from '@nestjs/common';
import { DependencyService } from './dependency.service';
import { DependencyResolver } from './dependency.resolver';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CustomLogger } from '@modules/common/logger/logger.service';

@Module({
  providers: [DependencyService, DependencyResolver, PrismaService, CustomLogger],
  exports: [DependencyService]
})
export class DependencyModule {}
