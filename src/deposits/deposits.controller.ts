import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { Deposit } from './entities/deposit.entity';
import { SavingsVaultService } from '../savings-vault/savings-vault.service';
import { TradesService } from '../trades/trades.service';
import { UsersService } from '../users/users.service';

@ApiTags('deposits')
@Controller('deposits')
export class DepositsController {
  constructor(
    private readonly depositsService: DepositsService,
    private readonly savingsVaultService: SavingsVaultService,
    private readonly tradesService: TradesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: '입금 생성' })
  @ApiResponse({ status: 201, description: '입금이 성공적으로 생성되었습니다.', type: Deposit })
  create(@Body() createDepositDto: CreateDepositDto): Promise<Deposit> {
    return this.depositsService.create(createDepositDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 입금 조회' })
  @ApiResponse({ status: 200, description: '입금 목록을 성공적으로 조회했습니다.', type: [Deposit] })
  findAll(): Promise<Deposit[]> {
    return this.depositsService.findAll();
  }

  @Get(':deposit_id')
  @ApiOperation({ summary: '입금 ID로 조회' })
  @ApiResponse({ status: 200, description: '입금을 성공적으로 조회했습니다.', type: Deposit })
  @ApiResponse({ status: 404, description: '입금을 찾을 수 없습니다.' })
  findOne(@Param('deposit_id', ParseIntPipe) deposit_id: number): Promise<Deposit> {
    return this.depositsService.findOne(deposit_id);
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: '사용자 ID로 입금 조회' })
  @ApiResponse({ status: 200, description: '사용자의 입금 목록을 성공적으로 조회했습니다.', type: [Deposit] })
  findByUserId(@Param('user_id', ParseIntPipe) user_id: number): Promise<Deposit[]> {
    return this.depositsService.findByUserId(user_id);
  }

  @Get('vault/:vault_id')
  @ApiOperation({ summary: '저금고 ID로 입금 조회' })
  @ApiResponse({ status: 200, description: '저금고의 입금 목록을 성공적으로 조회했습니다.', type: [Deposit] })
  findByVaultId(@Param('vault_id', ParseIntPipe) vault_id: number): Promise<Deposit[]> {
    return this.depositsService.findByVaultId(vault_id);
  }

  @Delete(':deposit_id')
  @ApiOperation({ summary: '입금 삭제' })
  @ApiResponse({ status: 200, description: '입금이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '입금을 찾을 수 없습니다.' })
  remove(@Param('deposit_id', ParseIntPipe) deposit_id: number): Promise<void> {
    return this.depositsService.remove(deposit_id);
  }

  @Get('balance')
  @ApiOperation({ summary: '잔액 조회' })
  @ApiQuery({ name: 'user_id', required: true, description: '사용자 ID' })
  @ApiQuery({ name: 'vault_id', required: false, description: '저금고 ID (선택사항)' })
  @ApiResponse({ status: 200, description: '잔액 정보를 성공적으로 조회했습니다.' })
  async getBalance(
    @Query('user_id') user_id: string,
    @Query('vault_id') vault_id?: string,
  ) {
    const userId = parseInt(user_id);
    
    if (vault_id) {
      const vaultId = parseInt(vault_id);
      const vault = await this.savingsVaultService.findOne(vaultId);
      const deposits = await this.depositsService.findByVaultId(vaultId);
      const trades = await this.tradesService.findByVaultId(vaultId);
      
      const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount_fiat, 0);
      const totalTrades = trades.reduce((sum, trade) => sum + trade.fiat_amount, 0);
      
      return {
        vault_id: vaultId,
        vault_name: vault.vault_name,
        target_token: vault.target_token,
        total_deposits: totalDeposits,
        total_trades: totalTrades,
        remaining_balance: totalDeposits - totalTrades,
        active: vault.active,
      };
    } else {
      const user = await this.usersService.findOne(userId);
      const vaults = await this.savingsVaultService.findByUserId(userId);
      
      const balanceSummary = await Promise.all(
        vaults.map(async (vault) => {
          const deposits = await this.depositsService.findByVaultId(vault.vault_id);
          const trades = await this.tradesService.findByVaultId(vault.vault_id);
          
          const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount_fiat, 0);
          const totalTrades = trades.reduce((sum, trade) => sum + trade.fiat_amount, 0);
          
          return {
            vault_id: vault.vault_id,
            vault_name: vault.vault_name,
            target_token: vault.target_token,
            total_deposits: totalDeposits,
            total_trades: totalTrades,
            remaining_balance: totalDeposits - totalTrades,
            active: vault.active,
          };
        })
      );
      
      return {
        user_id: userId,
        wallet_address: user.wallet_address,
        total_balance: balanceSummary.reduce((sum, vault) => sum + vault.remaining_balance, 0),
        vaults: balanceSummary,
      };
    }
  }
}
