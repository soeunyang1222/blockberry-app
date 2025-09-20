import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from '../trades/entities/trade.entity';
import { Deposit } from '../deposits/entities/deposit.entity';
import { SavingsVault } from '../savings-vault/entities/savings-vault.entity';
import { PriceService } from '../price/price.service';

export interface ProfitAnalysis {
  vault_id: number;
  vault_name: string;
  target_token: string;
  
  // 투자 정보
  total_invested: number;
  total_invested_krw: number;
  
  // 현재 가치
  current_token_amount: number;
  current_token_value_usd: number;
  current_token_value_krw: number;
  
  // 수익률
  profit_loss_usd: number;
  profit_loss_krw: number;
  profit_loss_percentage: number;
  
  // DCA vs CEX 비교
  dca_avg_price: number;
  cex_avg_price: number;
  dca_advantage: number;
  dca_advantage_percentage: number;
  
  // 통계
  total_trades: number;
  avg_trade_size: number;
  first_trade_date: string;
  last_trade_date: string;
}

export interface PortfolioSummary {
  user_id: number;
  total_invested_krw: number;
  total_current_value_krw: number;
  total_profit_loss_krw: number;
  total_profit_loss_percentage: number;
  vaults: ProfitAnalysis[];
  last_updated: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @InjectRepository(SavingsVault)
    private readonly savingsVaultRepository: Repository<SavingsVault>,
    private readonly priceService: PriceService,
  ) {}

  /**
   * 특정 저금고의 수익률 분석
   */
  async analyzeVaultProfit(vault_id: number): Promise<ProfitAnalysis> {
    try {
      // 저금고 정보 조회
      const vault = await this.savingsVaultRepository.findOne({
        where: { vault_id }
      });

      if (!vault) {
        throw new HttpException('Vault not found', HttpStatus.NOT_FOUND);
      }

      // 거래 내역 조회
      const trades = await this.tradeRepository.find({
        where: { vault_id },
        order: { created_at: 'ASC' }
      });

      // 입금 내역 조회
      const deposits = await this.depositRepository.find({
        where: { vault_id }
      });

      // 현재 토큰 가격 조회
      const currentPrice = await this.priceService.getCurrentBTCPrice();
      const exchangeRate = await this.priceService.getExchangeRate();

      // 투자 총액 계산
      const totalInvested = deposits.reduce((sum, deposit) => sum + deposit.amount_fiat, 0);
      const totalInvestedKRW = totalInvested; // 이미 KRW로 저장되어 있다고 가정

      // 현재 보유 토큰 수량
      const currentTokenAmount = trades.reduce((sum, trade) => sum + trade.token_amount, 0);

      // 현재 토큰 가치
      const currentTokenValueUSD = currentTokenAmount * currentPrice.current_price;
      const currentTokenValueKRW = currentTokenValueUSD * exchangeRate;

      // 수익/손실 계산
      const profitLossUSD = currentTokenValueUSD - (totalInvested / exchangeRate);
      const profitLossKRW = currentTokenValueKRW - totalInvestedKRW;
      const profitLossPercentage = (profitLossKRW / totalInvestedKRW) * 100;

      // DCA 평균 가격 계산
      const dcaAvgPrice = totalInvested / currentTokenAmount;

      // CEX 평균 가격 (첫 거래일부터 마지막 거래일까지의 평균)
      let cexAvgPrice = 0;
      if (trades.length > 0) {
        const firstTradeDate = trades[0].created_at;
        const lastTradeDate = trades[trades.length - 1].created_at;
        
        // 실제로는 CEX 가격 히스토리를 조회해야 함
        // 여기서는 현재 가격의 1.02배로 가정 (2% 프리미엄)
        cexAvgPrice = currentPrice.current_price * 1.02;
      }

      // DCA vs CEX 비교
      const dcaAdvantage = cexAvgPrice - dcaAvgPrice;
      const dcaAdvantagePercentage = (dcaAdvantage / cexAvgPrice) * 100;

      // 통계 계산
      const totalTrades = trades.length;
      const avgTradeSize = totalTrades > 0 ? totalInvested / totalTrades : 0;
      const firstTradeDate = trades.length > 0 ? trades[0].created_at.toISOString() : '';
      const lastTradeDate = trades.length > 0 ? trades[trades.length - 1].created_at.toISOString() : '';

      return {
        vault_id,
        vault_name: vault.vault_name,
        target_token: vault.target_token,
        total_invested: totalInvested,
        total_invested_krw: totalInvestedKRW,
        current_token_amount: currentTokenAmount,
        current_token_value_usd: currentTokenValueUSD,
        current_token_value_krw: currentTokenValueKRW,
        profit_loss_usd: profitLossUSD,
        profit_loss_krw: profitLossKRW,
        profit_loss_percentage: profitLossPercentage,
        dca_avg_price: dcaAvgPrice,
        cex_avg_price: cexAvgPrice,
        dca_advantage: dcaAdvantage,
        dca_advantage_percentage: dcaAdvantagePercentage,
        total_trades: totalTrades,
        avg_trade_size: avgTradeSize,
        first_trade_date: firstTradeDate,
        last_trade_date: lastTradeDate,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to analyze vault profit: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 사용자 전체 포트폴리오 수익률 분석
   */
  async analyzePortfolioProfit(user_id: number): Promise<PortfolioSummary> {
    try {
      // 사용자의 모든 저금고 조회
      const vaults = await this.savingsVaultRepository.find({
        where: { user_id }
      });

      // 각 저금고의 수익률 분석
      const vaultAnalyses = await Promise.all(
        vaults.map(vault => this.analyzeVaultProfit(vault.vault_id))
      );

      // 전체 포트폴리오 요약
      const totalInvestedKRW = vaultAnalyses.reduce((sum, vault) => sum + vault.total_invested_krw, 0);
      const totalCurrentValueKRW = vaultAnalyses.reduce((sum, vault) => sum + vault.current_token_value_krw, 0);
      const totalProfitLossKRW = totalCurrentValueKRW - totalInvestedKRW;
      const totalProfitLossPercentage = totalInvestedKRW > 0 ? (totalProfitLossKRW / totalInvestedKRW) * 100 : 0;

      return {
        user_id,
        total_invested_krw: totalInvestedKRW,
        total_current_value_krw: totalCurrentValueKRW,
        total_profit_loss_krw: totalProfitLossKRW,
        total_profit_loss_percentage: totalProfitLossPercentage,
        vaults: vaultAnalyses,
        last_updated: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        `Failed to analyze portfolio profit: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * DCA 시뮬레이션 (과거 데이터 기반)
   */
  async simulateDCA(
    startDate: string,
    endDate: string,
    amountKRW: number,
    intervalDays: number
  ): Promise<{
    dca_results: any[];
    cex_results: any[];
    comparison: {
      dca_total_invested: number;
      dca_total_tokens: number;
      dca_avg_price: number;
      cex_total_invested: number;
      cex_total_tokens: number;
      cex_avg_price: number;
      dca_advantage: number;
      dca_advantage_percentage: number;
    };
  }> {
    try {
      // 가격 히스토리 조회
      const priceHistory = await this.priceService.getDCASimulationData(startDate, endDate, 'daily');
      
      // DCA 시뮬레이션
      const dcaResults = [];
      const cexResults = [];
      let dcaTotalInvested = 0;
      let dcaTotalTokens = 0;
      let cexTotalInvested = 0;
      let cexTotalTokens = 0;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const current = new Date(start);

      while (current <= end) {
        const currentDate = current.toISOString().split('T')[0];
        
        // 해당 날짜의 가격 찾기
        const priceData = priceHistory.find(p => 
          new Date(p.timestamp).toISOString().split('T')[0] === currentDate
        );

        if (priceData) {
          const price = priceData.price;
          const tokensBought = amountKRW / price;
          
          dcaResults.push({
            date: currentDate,
            price: price,
            amount_invested: amountKRW,
            tokens_bought: tokensBought,
            total_invested: dcaTotalInvested + amountKRW,
            total_tokens: dcaTotalTokens + tokensBought,
            avg_price: (dcaTotalInvested + amountKRW) / (dcaTotalTokens + tokensBought)
          });

          dcaTotalInvested += amountKRW;
          dcaTotalTokens += tokensBought;

          // CEX 시뮬레이션 (2% 프리미엄)
          const cexPrice = price * 1.02;
          const cexTokensBought = amountKRW / cexPrice;
          
          cexResults.push({
            date: currentDate,
            price: cexPrice,
            amount_invested: amountKRW,
            tokens_bought: cexTokensBought,
            total_invested: cexTotalInvested + amountKRW,
            total_tokens: cexTotalTokens + cexTokensBought,
            avg_price: (cexTotalInvested + amountKRW) / (cexTotalTokens + cexTokensBought)
          });

          cexTotalInvested += amountKRW;
          cexTotalTokens += cexTokensBought;
        }

        // 다음 간격으로 이동
        current.setDate(current.getDate() + intervalDays);
      }

      // 비교 분석
      const dcaAvgPrice = dcaTotalInvested / dcaTotalTokens;
      const cexAvgPrice = cexTotalInvested / cexTotalTokens;
      const dcaAdvantage = cexAvgPrice - dcaAvgPrice;
      const dcaAdvantagePercentage = (dcaAdvantage / cexAvgPrice) * 100;

      return {
        dca_results: dcaResults,
        cex_results: cexResults,
        comparison: {
          dca_total_invested: dcaTotalInvested,
          dca_total_tokens: dcaTotalTokens,
          dca_avg_price: dcaAvgPrice,
          cex_total_invested: cexTotalInvested,
          cex_total_tokens: cexTotalTokens,
          cex_avg_price: cexAvgPrice,
          dca_advantage: dcaAdvantage,
          dca_advantage_percentage: dcaAdvantagePercentage,
        }
      };
    } catch (error) {
      throw new HttpException(
        `Failed to simulate DCA: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
