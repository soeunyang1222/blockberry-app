import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsVault } from './entities/savings-vault.entity';
import { CreateSavingsVaultDto } from './dto/create-savings-vault.dto';

@Injectable()
export class SavingsVaultService {
  constructor(
    @InjectRepository(SavingsVault)
    private readonly savingsVaultRepository: Repository<SavingsVault>,
  ) {}

  async create(createSavingsVaultDto: CreateSavingsVaultDto): Promise<SavingsVault> {
    const savingsVault = this.savingsVaultRepository.create(createSavingsVaultDto);
    return await this.savingsVaultRepository.save(savingsVault);
  }

  async findAll(): Promise<SavingsVault[]> {
    return await this.savingsVaultRepository.find({
      relations: ['user', 'deposits', 'trades'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(vault_id: number): Promise<SavingsVault> {
    const savingsVault = await this.savingsVaultRepository.findOne({
      where: { vault_id },
      relations: ['user', 'deposits', 'trades'],
    });

    if (!savingsVault) {
      throw new NotFoundException('Savings vault not found');
    }

    return savingsVault;
  }

  async findByUserId(user_id: number): Promise<SavingsVault[]> {
    return await this.savingsVaultRepository.find({
      where: { user_id },
      relations: ['user', 'deposits', 'trades'],
      order: { created_at: 'DESC' },
    });
  }

  async updateTotalDeposit(vault_id: number, amount: number): Promise<SavingsVault> {
    const savingsVault = await this.findOne(vault_id);
    savingsVault.total_deposit += amount;
    return await this.savingsVaultRepository.save(savingsVault);
  }

  async updateActiveStatus(vault_id: number, active: boolean): Promise<SavingsVault> {
    const savingsVault = await this.findOne(vault_id);
    savingsVault.active = active;
    return await this.savingsVaultRepository.save(savingsVault);
  }

  async remove(vault_id: number): Promise<void> {
    const savingsVault = await this.findOne(vault_id);
    await this.savingsVaultRepository.remove(savingsVault);
  }
}
