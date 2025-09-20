import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('vault-profit/:vault_id')
  @ApiOperation({ summary: '저금고 수익률 분석' })
  @ApiResponse({ status: 200, description: '저금고 수익률 분석을 성공적으로 조회했습니다.' })
  async analyzeVaultProfit(@Param('vault_id', ParseIntPipe) vault_id: number) {
    return await this.analyticsService.analyzeVaultProfit(vault_id);
  }

  @Get('portfolio-profit/:user_id')
  @ApiOperation({ summary: '포트폴리오 전체 수익률 분석' })
  @ApiResponse({ status: 200, description: '포트폴리오 수익률 분석을 성공적으로 조회했습니다.' })
  async analyzePortfolioProfit(@Param('user_id', ParseIntPipe) user_id: number) {
    return await this.analyticsService.analyzePortfolioProfit(user_id);
  }

  @Get('dca-simulation')
  @ApiOperation({ summary: 'DCA 시뮬레이션 (과거 데이터 기반)' })
  @ApiQuery({ name: 'start_date', required: true, description: '시작 날짜 (YYYY-MM-DD)' })
  @ApiQuery({ name: 'end_date', required: true, description: '종료 날짜 (YYYY-MM-DD)' })
  @ApiQuery({ name: 'amount_krw', required: true, description: '매수 금액 (KRW)' })
  @ApiQuery({ name: 'interval_days', required: true, description: '매수 간격 (일)' })
  @ApiResponse({ status: 200, description: 'DCA 시뮬레이션을 성공적으로 실행했습니다.' })
  async simulateDCA(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('amount_krw') amount_krw: string,
    @Query('interval_days') interval_days: string,
  ) {
    return await this.analyticsService.simulateDCA(
      start_date,
      end_date,
      parseInt(amount_krw),
      parseInt(interval_days)
    );
  }
}
