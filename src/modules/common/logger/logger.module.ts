import { Module } from '@nestjs/common';
import { CustomLogger } from '@modules/common/logger/logger.service';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class CommonModule {}
