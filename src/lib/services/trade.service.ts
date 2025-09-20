import { Repository } from 'typeorm';
import { getDataSource } from '../database/connection';
import { Trade } from '../database/entities/trade.entity';

export interface CreateTradeDto {
  vault_id: number;
  user_id: number;
  fiat_amount: number;
  fiat_symbol: string;
  token_symbol: string;
  token_amount: number;
  price_executed: number;
  tx_hash: string;
}

export class TradeService {
  private tradeRepository: Repository<Trade> | null = null;

  private async getTradeRepository(): Promise<Repository<Trade>> {
    if (!this.tradeRepository) {
      const dataSource = await getDataSource();
      this.tradeRepository = dataSource.getRepository(Trade);
    }
    return this.tradeRepository;
  }

  async create(createTradeDto: CreateTradeDto): Promise<Trade> {
    const repository = await this.getTradeRepository();
    const trade = repository.create(createTradeDto);
    return await repository.save(trade);
  }

  async findAll(): Promise<Trade[]> {
    const repository = await this.getTradeRepository();
    return await repository.find({
      relations: ['user', 'savings_vault'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(trade_id: number): Promise<Trade | null> {
    const repository = await this.getTradeRepository();
    return await repository.findOne({
      where: { trade_id },
      relations: ['user', 'savings_vault'],
    });
  }

  async findByUserId(user_id: number): Promise<Trade[]> {
    const repository = await this.getTradeRepository();
    return await repository.find({
      where: { user_id },
      relations: ['savings_vault'],
      order: { created_at: 'DESC' },
    });
  }

  async findByVaultId(vault_id: number): Promise<Trade[]> {
    const repository = await this.getTradeRepository();
    return await repository.find({
      where: { vault_id },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async remove(trade_id: number): Promise<void> {
    const repository = await this.getTradeRepository();
    const trade = await this.findOne(trade_id);
    if (!trade) {
      throw new Error('Trade not found');
    }
    await repository.remove(trade);
  }

  async getTradingStats(user_id: number, vault_id?: number): Promise<{
    total_trades: number;
    total_invested: number;
    total_tokens: number;
    average_price: number;
    trades: Trade[];
  }> {
    const repository = await this.getTradeRepository();
    
    const queryBuilder = repository.createQueryBuilder('trade')
      .where('trade.user_id = :user_id', { user_id });
    
    if (vault_id) {
      queryBuilder.andWhere('trade.vault_id = :vault_id', { vault_id });
    }
    
    const trades = await queryBuilder
      .orderBy('trade.created_at', 'DESC')
      .getMany();
    
    const total_trades = trades.length;
    const total_invested = trades.reduce((sum, trade) => sum + trade.fiat_amount, 0);
    const total_tokens = trades.reduce((sum, trade) => sum + trade.token_amount, 0);
    const average_price = total_invested > 0 ? total_invested / total_tokens : 0;
    
    return {
      total_trades,
      total_invested,
      total_tokens,
      average_price,
      trades,
    };
  }

  /**
   * 최근 거래내역을 조회합니다
   * @param user_id 사용자 ID (선택사항)
   * @param vault_id 저금고 ID (선택사항)
   * @param limit 조회할 거래 수 (기본값: 10)
   * @returns 최근 거래내역 배열
   */
  async getRecentTrades(user_id?: number, vault_id?: number, limit: number = 10): Promise<Trade[]> {
    const repository = await this.getTradeRepository();
    
    const queryBuilder = repository.createQueryBuilder('trade')
      .leftJoinAndSelect('trade.user', 'user')
      .leftJoinAndSelect('trade.savings_vault', 'savings_vault')
      .orderBy('trade.created_at', 'DESC')
      .limit(limit);
    
    if (user_id) {
      queryBuilder.andWhere('trade.user_id = :user_id', { user_id });
    }
    
    if (vault_id) {
      queryBuilder.andWhere('trade.vault_id = :vault_id', { vault_id });
    }
    
    return await queryBuilder.getMany();
  }

  /**
   * 사용자의 최근 거래내역을 조회합니다
   * @param user_id 사용자 ID
   * @param limit 조회할 거래 수 (기본값: 10)
   * @returns 사용자의 최근 거래내역 배열
   */
  async getRecentTradesByUser(user_id: number, limit: number = 10): Promise<Trade[]> {
    return await this.getRecentTrades(user_id, undefined, limit);
  }

  /**
   * 저금고의 최근 거래내역을 조회합니다
   * @param vault_id 저금고 ID
   * @param limit 조회할 거래 수 (기본값: 10)
   * @returns 저금고의 최근 거래내역 배열
   */
  async getRecentTradesByVault(vault_id: number, limit: number = 10): Promise<Trade[]> {
    return await this.getRecentTrades(undefined, vault_id, limit);
  }
}

export const tradeService = new TradeService();
