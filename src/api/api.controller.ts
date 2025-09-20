import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { SavingsVaultService } from '../savings-vault/savings-vault.service';
import { DepositsService } from '../deposits/deposits.service';
import { TradesService } from '../trades/trades.service';
import { SuiService } from '../sui/sui.service';
import { CetusService } from '../cetus/cetus.service';
import { PriceService } from '../price/price.service';
import { OrderBookService } from '../orderbook/orderbook.service';
import { SuiRPCService } from '../sui-rpc/sui-rpc.service';
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
    private readonly suiService: SuiService,
    private readonly cetusService: CetusService,
    private readonly priceService: PriceService,
    private readonly orderBookService: OrderBookService,
    private readonly suiRPCService: SuiRPCService,
  ) {}

  // 저금고 관련 API는 /savings-vault로 이동됨

  @Post('deposit')
  @ApiOperation({ summary: '입금 처리' })
  @ApiResponse({ status: 201, description: '입금이 성공적으로 처리되었습니다.' })
  async deposit(@Body() createDepositDto: CreateDepositDto) {
    return await this.depositsService.create(createDepositDto);
  }


  @Post('execute-buy')
  @ApiOperation({ summary: 'DCA 매수 실행 (오더북 방식 사용)' })
  @ApiResponse({ status: 201, description: '매수가 성공적으로 실행되었습니다.' })
  async executeBuy(@Body() createTradeDto: CreateTradeDto) {
    // 사용자 정보 조회
    const user = await this.usersService.findOne(createTradeDto.user_id);
    
    // 오더북 기반 DCA 스왑 실행 (USDC → BTC)
    const swapResult = await this.orderBookService.executeDCASwap(
      user.wallet_address,
      createTradeDto.fiat_amount.toString(),
      0.5 // 0.5% 슬리피지
    );

    // 거래 기록 저장
    const trade = await this.tradesService.create(createTradeDto);

    return {
      trade,
      swap_result: swapResult,
      message: swapResult.message
    };
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
  @ApiOperation({ summary: '지갑 주소 검증 (Sui SDK 사용)' })
  @ApiQuery({ name: 'wallet_address', required: true, description: '지갑 주소' })
  @ApiResponse({ status: 200, description: '지갑 주소 검증 정보를 성공적으로 조회했습니다.' })
  async verifyWallet(@Query('wallet_address') wallet_address: string) {
    try {
      const accountInfo = await this.suiService.getAccountByHash(wallet_address);
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

  @Get('btc-price')
  @ApiOperation({ summary: 'BTC 현재 가격 조회' })
  @ApiResponse({ status: 200, description: 'BTC 가격을 성공적으로 조회했습니다.' })
  async getBTCPrice() {
    return await this.priceService.getCurrentBTCPrice();
  }

  @Get('swap-quote')
  @ApiOperation({ summary: 'USDC → BTC 스왑 쿼트 조회' })
  @ApiQuery({ name: 'amount', required: true, description: 'USDC 금액' })
  @ApiQuery({ name: 'user_address', required: true, description: '사용자 지갑 주소' })
  @ApiResponse({ status: 200, description: '스왑 쿼트를 성공적으로 조회했습니다.' })
  async getSwapQuote(
    @Query('amount') amount: string,
    @Query('user_address') user_address: string,
  ) {
    const swapParams = {
      fromToken: '0x5d4b302506645c3ff4b2c70d70cb120acec5fa6742f315893216b743d5e1b596::usdc::USDC',
      toToken: '0x2::sui::SUI', // 임시로 SUI 사용
      amount: amount,
      slippage: 0.5,
      userAddress: user_address
    };

    return await this.cetusService.getSwapQuote(swapParams);
  }

  @Get('dca-simulation')
  @ApiOperation({ summary: 'DCA 시뮬레이션 데이터 조회' })
  @ApiQuery({ name: 'days', required: false, description: '시뮬레이션 기간 (일)' })
  @ApiResponse({ status: 200, description: 'DCA 시뮬레이션 데이터를 성공적으로 조회했습니다.' })
  async getDCASimulation(@Query('days') days: string = '30') {
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString();
    
    return await this.priceService.getDCASimulationData(startDate, endDate, 'daily');
  }

  @Get('orderbook')
  @ApiOperation({ summary: '오더북 조회 (Bid/Ask 주문서)' })
  @ApiQuery({ name: 'base_token', required: true, description: '기본 토큰 (예: BTC)' })
  @ApiQuery({ name: 'quote_token', required: true, description: '견적 토큰 (예: USDC)' })
  @ApiResponse({ status: 200, description: '오더북을 성공적으로 조회했습니다.' })
  async getOrderBook(
    @Query('base_token') base_token: string,
    @Query('quote_token') quote_token: string,
  ) {
    return await this.orderBookService.getOrderBook(base_token, quote_token);
  }

  @Get('orderbook-swap-quote')
  @ApiOperation({ summary: '오더북 기반 스왑 쿼트 조회' })
  @ApiQuery({ name: 'base_token', required: true, description: '기본 토큰' })
  @ApiQuery({ name: 'quote_token', required: true, description: '견적 토큰' })
  @ApiQuery({ name: 'amount', required: true, description: '거래 금액' })
  @ApiQuery({ name: 'side', required: true, description: '거래 방향 (buy/sell)' })
  @ApiResponse({ status: 200, description: '오더북 기반 스왑 쿼트를 성공적으로 조회했습니다.' })
  async getOrderBookSwapQuote(
    @Query('base_token') base_token: string,
    @Query('quote_token') quote_token: string,
    @Query('amount') amount: string,
    @Query('side') side: 'buy' | 'sell',
  ) {
    return await this.orderBookService.calculateOptimalPrice(
      base_token,
      quote_token,
      amount,
      side
    );
  }

  @Get('recent-transactions')
  @ApiOperation({ summary: '최근 거래 내역 10개 조회 (Sui JSON-RPC 직접 호출)' })
  @ApiQuery({ name: 'wallet_address', required: true, description: '지갑 주소' })
  @ApiQuery({ name: 'limit', required: false, description: '조회할 거래 수 (기본값: 10)' })
  @ApiResponse({ status: 200, description: '최근 거래 내역을 성공적으로 조회했습니다.' })
  async getRecentTransactions(
    @Query('wallet_address') wallet_address: string,
    @Query('limit') limit: string = '10',
  ) {
    return await this.suiRPCService.getRecentTransactions(
      wallet_address,
      parseInt(limit)
    );
  }

  @Get('coin-info')
  @ApiOperation({ summary: '코인 정보 조회 (Coin Query API)' })
  @ApiQuery({ name: 'wallet_address', required: true, description: '지갑 주소' })
  @ApiQuery({ name: 'coin_type', required: false, description: '코인 타입 (기본값: SUI)' })
  @ApiQuery({ name: 'limit', required: false, description: '조회할 코인 수 (기본값: 10)' })
  @ApiResponse({ status: 200, description: '코인 정보를 성공적으로 조회했습니다.' })
  async getCoinInfo(
    @Query('wallet_address') wallet_address: string,
    @Query('coin_type') coin_type: string = '0x2::sui::SUI',
    @Query('limit') limit: string = '10',
  ) {
    return await this.suiRPCService.getCoins(
      wallet_address,
      coin_type,
      null,
      parseInt(limit)
    );
  }

  @Get('usdc-coins')
  @ApiOperation({ summary: 'USDC 코인 정보 조회' })
  @ApiQuery({ name: 'wallet_address', required: true, description: '지갑 주소' })
  @ApiQuery({ name: 'limit', required: false, description: '조회할 코인 수 (기본값: 10)' })
  @ApiResponse({ status: 200, description: 'USDC 코인 정보를 성공적으로 조회했습니다.' })
  async getUSDCCoins(
    @Query('wallet_address') wallet_address: string,
    @Query('limit') limit: string = '10',
  ) {
    return await this.suiRPCService.getUSDCCoins(
      wallet_address,
      null,
      parseInt(limit)
    );
  }

}
