import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { SavingsVaultService } from '../savings-vault/savings-vault.service';
import { DepositsService } from '../deposits/deposits.service';
import { TradesService } from '../trades/trades.service';
import { BlockberryService } from '../blockberry/blockberry.service';
import { CreateSavingsVaultDto } from '../savings-vault/dto/create-savings-vault.dto';
import { CreateDepositDto } from '../deposits/dto/create-deposit.dto';
import { CreateTradeDto } from '../trades/dto/create-trade.dto';

@ApiTags('api')
@Controller('api')
export class ApiController {
  constructor(
    private readonly usersService: UsersService,
    private readonly savingsVaultService: SavingsVaultService,
    private readonly depositsService: DepositsService,
    private readonly tradesService: TradesService,
    private readonly blockberryService: BlockberryService,
  ) {}

  @Post('create-savings')
  @ApiOperation({ summary: '저금고 생성' })
  @ApiResponse({ status: 201, description: '저금고가 성공적으로 생성되었습니다.' })
  async createSavings(@Body() createSavingsVaultDto: CreateSavingsVaultDto) {
    return await this.savingsVaultService.create(createSavingsVaultDto);
  }

  @Post('deposit')
  @ApiOperation({ summary: '입금 처리' })
  @ApiResponse({ status: 201, description: '입금이 성공적으로 처리되었습니다.' })
  async deposit(@Body() createDepositDto: CreateDepositDto) {
    return await this.depositsService.create(createDepositDto);
  }


  @Post('execute-buy')
  @ApiOperation({ summary: '매수 실행' })
  @ApiResponse({ status: 201, description: '매수가 성공적으로 실행되었습니다.' })
  async executeBuy(@Body() createTradeDto: CreateTradeDto) {
    return await this.tradesService.create(createTradeDto);
  }

  @Get('transactions')
  @ApiOperation({ summary: '거래 내역 조회' })
  @ApiQuery({ name: 'user_id', required: false, description: '사용자 ID' })
  @ApiQuery({ name: 'vault_id', required: false, description: '저금고 ID' })
  @ApiQuery({ name: 'type', required: false, description: '거래 타입 (deposit, trade)' })
  @ApiResponse({ status: 200, description: '거래 내역을 성공적으로 조회했습니다.' })
  async getTransactions(
    @Query('user_id') user_id?: string,
    @Query('vault_id') vault_id?: string,
    @Query('type') type?: string,
  ) {
    const transactions = [];
    
    if (type === 'deposit' || !type) {
      let deposits = [];
      if (user_id) {
        deposits = await this.depositsService.findByUserId(parseInt(user_id));
      } else if (vault_id) {
        deposits = await this.depositsService.findByVaultId(parseInt(vault_id));
      } else {
        deposits = await this.depositsService.findAll();
      }
      
      transactions.push(...deposits.map(deposit => ({
        id: deposit.deposit_id,
        type: 'deposit',
        amount: deposit.amount_fiat,
        symbol: deposit.fiat_symbol,
        tx_hash: deposit.tx_hash,
        created_at: deposit.created_at,
        vault_id: deposit.vault_id,
        user_id: deposit.user_id,
      })));
    }
    
    if (type === 'trade' || !type) {
      let trades = [];
      if (user_id) {
        trades = await this.tradesService.findByUserId(parseInt(user_id));
      } else if (vault_id) {
        trades = await this.tradesService.findByVaultId(parseInt(vault_id));
      } else {
        trades = await this.tradesService.findAll();
      }
      
      transactions.push(...trades.map(trade => ({
        id: trade.trade_id,
        type: 'trade',
        fiat_amount: trade.fiat_amount,
        fiat_symbol: trade.fiat_symbol,
        token_amount: trade.token_amount,
        token_symbol: trade.token_symbol,
        price_executed: trade.price_executed,
        tx_hash: trade.tx_hash,
        vault_id: trade.vault_id,
        user_id: trade.user_id,
      })));
    }
    
    // 생성일시 기준으로 정렬
    transactions.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    
    return {
      transactions,
      total_count: transactions.length,
    };
  }


  @Get('verify-wallet')
  @ApiOperation({ summary: '지갑 주소 검증' })
  @ApiQuery({ name: 'wallet_address', required: true, description: '지갑 주소' })
  @ApiResponse({ status: 200, description: '지갑 주소 검증 정보를 성공적으로 조회했습니다.' })
  async verifyWallet(@Query('wallet_address') wallet_address: string) {
    try {
      const accountInfo = await this.blockberryService.getAccountByHash(wallet_address);
      return {
        valid: true,
        wallet_address,
        account_info: accountInfo,
      };
    } catch (error) {
      return {
        valid: false,
        wallet_address,
        error: error.message,
      };
    }
  }
}
