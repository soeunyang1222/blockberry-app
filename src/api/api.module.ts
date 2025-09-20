import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UsersModule } from '../users/users.module';
import { SavingsVaultModule } from '../savings-vault/savings-vault.module';
import { DepositsModule } from '../deposits/deposits.module';
import { TradesModule } from '../trades/trades.module';
import { SuiModule } from '../sui/sui.module';
import { CetusModule } from '../cetus/cetus.module';
import { PriceModule } from '../price/price.module';
import { OrderBookModule } from '../orderbook/orderbook.module';
import { SuiRPCModule } from '../sui-rpc/sui-rpc.module';

@Module({
  imports: [
    UsersModule,
    SavingsVaultModule,
    DepositsModule,
    TradesModule,
    SuiModule,
    CetusModule,
    PriceModule,
    OrderBookModule,
    SuiRPCModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
