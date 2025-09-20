import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { Deposit } from './entities/deposit.entity';
import { SavingsVaultModule } from '../savings-vault/savings-vault.module';
import { TradesModule } from '../trades/trades.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deposit]),
    SavingsVaultModule,
    TradesModule,
    UsersModule,
  ],
  controllers: [DepositsController],
  providers: [DepositsService],
  exports: [DepositsService],
})
export class DepositsModule {}
