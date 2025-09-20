import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlockberryService } from './blockberry.service';

@Module({
  imports: [HttpModule],
  providers: [BlockberryService],
  exports: [BlockberryService],
})
export class BlockberryModule {}
