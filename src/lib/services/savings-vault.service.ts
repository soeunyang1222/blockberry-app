import { Repository } from 'typeorm';
import { getDataSource } from '../database/connection';
import { SavingsVault } from '../database/entities/savings-vault.entity';

export interface CreateSavingsVaultDto {
  user_id: number;
  vault_name: string;
  target_token: string;
  interval_days: number;
  amount_fiat: number;
  fiat_symbol: string;
  duration_days: number;
  active?: boolean;
}

export interface UpdateSavingsVaultDto {
  vault_name?: string;
  target_token?: string;
  interval_days?: number;
  amount_fiat?: number;
  fiat_symbol?: string;
  duration_days?: number;
  active?: boolean;
}

export class SavingsVaultService {
  private savingsVaultRepository: Repository<SavingsVault> | null = null;

  private async getSavingsVaultRepository(): Promise<Repository<SavingsVault>> {
    if (!this.savingsVaultRepository) {
      const dataSource = await getDataSource();
      this.savingsVaultRepository = dataSource.getRepository(SavingsVault);
    }
    return this.savingsVaultRepository;
  }

  async create(createSavingsVaultDto: CreateSavingsVaultDto): Promise<SavingsVault> {
    const repository = await this.getSavingsVaultRepository();
    const savingsVault = repository.create({
      ...createSavingsVaultDto,
      active: createSavingsVaultDto.active ?? true,
    });
    return await repository.save(savingsVault);
  }

  async findAll(): Promise<SavingsVault[]> {
    const repository = await this.getSavingsVaultRepository();
    return await repository.find({
      relations: ['user', 'deposits', 'trades'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(vault_id: number): Promise<SavingsVault | null> {
    const repository = await this.getSavingsVaultRepository();
    return await repository.findOne({
      where: { vault_id },
      relations: ['user', 'deposits', 'trades'],
    });
  }

  async findByUserId(user_id: number): Promise<SavingsVault[]> {
    const repository = await this.getSavingsVaultRepository();
    return await repository.find({
      where: { user_id },
      relations: ['deposits', 'trades'],
      order: { created_at: 'DESC' },
    });
  }

  async update(vault_id: number, updateSavingsVaultDto: UpdateSavingsVaultDto): Promise<SavingsVault | null> {
    const repository = await this.getSavingsVaultRepository();
    const savingsVault = await this.findOne(vault_id);
    
    if (!savingsVault) {
      return null;
    }

    Object.assign(savingsVault, updateSavingsVaultDto);
    return await repository.save(savingsVault);
  }

  async updateActiveStatus(vault_id: number, active: boolean): Promise<SavingsVault | null> {
    return await this.update(vault_id, { active });
  }

  async remove(vault_id: number): Promise<void> {
    const repository = await this.getSavingsVaultRepository();
    const savingsVault = await this.findOne(vault_id);
    if (!savingsVault) {
      throw new Error('Savings vault not found');
    }
    await repository.remove(savingsVault);
  }
}

export const savingsVaultService = new SavingsVaultService();
