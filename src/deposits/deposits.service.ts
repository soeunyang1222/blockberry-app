import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit } from './entities/deposit.entity';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { SavingsVaultService } from '../savings-vault/savings-vault.service';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    private readonly savingsVaultService: SavingsVaultService,
  ) {}

  async create(createDepositDto: CreateDepositDto): Promise<Deposit> {
    const deposit = this.depositRepository.create(createDepositDto);
    const savedDeposit = await this.depositRepository.save(deposit);

    // 저금고의 총 입금액 업데이트
    await this.savingsVaultService.updateTotalDeposit(
      createDepositDto.vault_id,
      createDepositDto.amount_fiat,
    );

    return savedDeposit;
  }

  async findAll(): Promise<Deposit[]> {
    return await this.depositRepository.find({
      relations: ['user', 'savings_vault'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(deposit_id: number): Promise<Deposit> {
    const deposit = await this.depositRepository.findOne({
      where: { deposit_id },
      relations: ['user', 'savings_vault'],
    });

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    return deposit;
  }

  async findByUserId(user_id: number): Promise<Deposit[]> {
    return await this.depositRepository.find({
      where: { user_id },
      relations: ['user', 'savings_vault'],
      order: { created_at: 'DESC' },
    });
  }

  async findByVaultId(vault_id: number): Promise<Deposit[]> {
    return await this.depositRepository.find({
      where: { vault_id },
      relations: ['user', 'savings_vault'],
      order: { created_at: 'DESC' },
    });
  }

  async remove(deposit_id: number): Promise<void> {
    const deposit = await this.findOne(deposit_id);
    await this.depositRepository.remove(deposit);
  }
}
