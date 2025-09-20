import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsVaultService } from './savings-vault.service';
import { SavingsVaultController } from './savings-vault.controller';
import { SavingsVault } from './entities/savings-vault.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsVault])],
  controllers: [SavingsVaultController],
  providers: [SavingsVaultService],
  exports: [SavingsVaultService],
})
export class SavingsVaultModule {}
