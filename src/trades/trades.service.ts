import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from './entities/trade.entity';
import { CreateTradeDto } from './dto/create-trade.dto';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,
  ) {}

  async create(createTradeDto: CreateTradeDto): Promise<Trade> {
    const trade = this.tradeRepository.create(createTradeDto);
    return await this.tradeRepository.save(trade);
  }

  async findAll(): Promise<Trade[]> {
    return await this.tradeRepository.find({
      relations: ['user', 'savings_vault'],
    });
  }

  async findOne(trade_id: number): Promise<Trade> {
    const trade = await this.tradeRepository.findOne({
      where: { trade_id },
      relations: ['user', 'savings_vault'],
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return trade;
  }

  async findByUserId(user_id: number): Promise<Trade[]> {
    return await this.tradeRepository.find({
      where: { user_id },
      relations: ['user', 'savings_vault'],
    });
  }

  async findByVaultId(vault_id: number): Promise<Trade[]> {
    return await this.tradeRepository.find({
      where: { vault_id },
      relations: ['user', 'savings_vault'],
    });
  }

  async remove(trade_id: number): Promise<void> {
    const trade = await this.findOne(trade_id);
    await this.tradeRepository.remove(trade);
  }
}
