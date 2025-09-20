import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UsersModule } from '../users/users.module';
import { SavingsVaultModule } from '../savings-vault/savings-vault.module';
import { DepositsModule } from '../deposits/deposits.module';
import { TradesModule } from '../trades/trades.module';
import { BlockberryModule } from '../blockberry/blockberry.module';

@Module({
  imports: [
    UsersModule,
    SavingsVaultModule,
    DepositsModule,
    TradesModule,
    BlockberryModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
