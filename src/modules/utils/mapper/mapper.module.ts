import { Module } from '@nestjs/common';
import { EntityMapperService } from '@modules/utils/mapper/mapper.service';

@Module({
  providers: [EntityMapperService],
  exports: [EntityMapperService],
})
export class EntityMapperModule {}
