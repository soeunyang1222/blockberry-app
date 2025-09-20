import { Repository } from 'typeorm';
import { getDataSource } from '../database/connection';
import { Deposit } from '../database/entities/deposit.entity';

export interface CreateDepositDto {
  vault_id: number;
  user_id: number;
  amount_fiat: number;
  fiat_symbol: string;
  tx_hash: string;
}

export class DepositService {
  private depositRepository: Repository<Deposit> | null = null;

  private async getDepositRepository(): Promise<Repository<Deposit>> {
    if (!this.depositRepository) {
      const dataSource = await getDataSource();
      this.depositRepository = dataSource.getRepository(Deposit);
    }
    return this.depositRepository;
  }

  async create(createDepositDto: CreateDepositDto): Promise<Deposit> {
    const repository = await this.getDepositRepository();
    const deposit = repository.create(createDepositDto);
    return await repository.save(deposit);
  }

  async findAll(): Promise<Deposit[]> {
    const repository = await this.getDepositRepository();
    return await repository.find({
      relations: ['user', 'savings_vault'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(deposit_id: number): Promise<Deposit | null> {
    const repository = await this.getDepositRepository();
    return await repository.findOne({
      where: { deposit_id },
      relations: ['user', 'savings_vault'],
    });
  }

  async findByUserId(user_id: number): Promise<Deposit[]> {
    const repository = await this.getDepositRepository();
    return await repository.find({
      where: { user_id },
      relations: ['savings_vault'],
      order: { created_at: 'DESC' },
    });
  }

  async findByVaultId(vault_id: number): Promise<Deposit[]> {
    const repository = await this.getDepositRepository();
    return await repository.find({
      where: { vault_id },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async remove(deposit_id: number): Promise<void> {
    const repository = await this.getDepositRepository();
    const deposit = await this.findOne(deposit_id);
    if (!deposit) {
      throw new Error('Deposit not found');
    }
    await repository.remove(deposit);
  }

  async getBalance(user_id: number, vault_id?: number): Promise<{ total_balance: number; deposits: Deposit[] }> {
    const repository = await this.getDepositRepository();
    
    const queryBuilder = repository.createQueryBuilder('deposit')
      .where('deposit.user_id = :user_id', { user_id });
    
    if (vault_id) {
      queryBuilder.andWhere('deposit.vault_id = :vault_id', { vault_id });
    }
    
    const deposits = await queryBuilder
      .orderBy('deposit.created_at', 'DESC')
      .getMany();
    
    const total_balance = deposits.reduce((sum, deposit) => sum + deposit.amount_fiat, 0);
    
    return { total_balance, deposits };
  }
}

export const depositService = new DepositService();
