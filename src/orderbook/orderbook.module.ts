import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderBookService } from './orderbook.service';

@Module({
  imports: [ConfigModule],
  providers: [OrderBookService],
  exports: [OrderBookService],
})
export class OrderBookModule {}
