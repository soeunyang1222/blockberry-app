import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CetusService } from './cetus.service';

@Module({
  imports: [ConfigModule],
  providers: [CetusService],
  exports: [CetusService],
})
export class CetusModule {}
