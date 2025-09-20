import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Trade } from '../trades/entities/trade.entity';
import { Deposit } from '../deposits/entities/deposit.entity';
import { SavingsVault } from '../savings-vault/entities/savings-vault.entity';
import { PriceModule } from '../price/price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade, Deposit, SavingsVault]),
    PriceModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
