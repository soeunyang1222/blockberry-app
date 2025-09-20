import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { Trade } from './entities/trade.entity';

@ApiTags('trades')
@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  @ApiOperation({ summary: '거래 생성' })
  @ApiResponse({ status: 201, description: '거래가 성공적으로 생성되었습니다.', type: Trade })
  create(@Body() createTradeDto: CreateTradeDto): Promise<Trade> {
    return this.tradesService.create(createTradeDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 거래 조회' })
  @ApiResponse({ status: 200, description: '거래 목록을 성공적으로 조회했습니다.', type: [Trade] })
  findAll(): Promise<Trade[]> {
    return this.tradesService.findAll();
  }

  @Get(':trade_id')
  @ApiOperation({ summary: '거래 ID로 조회' })
  @ApiResponse({ status: 200, description: '거래를 성공적으로 조회했습니다.', type: Trade })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없습니다.' })
  findOne(@Param('trade_id', ParseIntPipe) trade_id: number): Promise<Trade> {
    return this.tradesService.findOne(trade_id);
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: '사용자 ID로 거래 조회' })
  @ApiResponse({ status: 200, description: '사용자의 거래 목록을 성공적으로 조회했습니다.', type: [Trade] })
  findByUserId(@Param('user_id', ParseIntPipe) user_id: number): Promise<Trade[]> {
    return this.tradesService.findByUserId(user_id);
  }

  @Get('vault/:vault_id')
  @ApiOperation({ summary: '저금고 ID로 거래 조회' })
  @ApiResponse({ status: 200, description: '저금고의 거래 목록을 성공적으로 조회했습니다.', type: [Trade] })
  findByVaultId(@Param('vault_id', ParseIntPipe) vault_id: number): Promise<Trade[]> {
    return this.tradesService.findByVaultId(vault_id);
  }

  @Delete(':trade_id')
  @ApiOperation({ summary: '거래 삭제' })
  @ApiResponse({ status: 200, description: '거래가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '거래를 찾을 수 없습니다.' })
  remove(@Param('trade_id', ParseIntPipe) trade_id: number): Promise<void> {
    return this.tradesService.remove(trade_id);
  }
}
