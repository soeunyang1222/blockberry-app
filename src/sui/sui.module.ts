import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SuiService } from './sui.service';

@Module({
  imports: [ConfigModule],
  providers: [SuiService],
  exports: [SuiService],
})
export class SuiModule {}
