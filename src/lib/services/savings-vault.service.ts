import { Repository } from 'typeorm';
import { getDataSource } from '../database/connection';
import { SavingsVault } from '../database/entities/savings-vault.entity';

export interface CreateSavingsVaultDto {
  user_id: number;
  vault_name: string;
  target_token: string;
  amount_fiat: number;
  fiat_symbol: string;
  active?: boolean;
}

export interface UpdateSavingsVaultDto {
  vault_name?: string;
  target_token?: string;
  amount_fiat?: number;
  fiat_symbol?: string;
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
      relations: ['user', 'trades'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(vault_id: number): Promise<SavingsVault | null> {
    const repository = await this.getSavingsVaultRepository();
    return await repository.findOne({
      where: { vault_id },
      relations: ['user', 'trades'],
    });
  }

  async findByUserId(user_id: number): Promise<SavingsVault[]> {
    const repository = await this.getSavingsVaultRepository();
    return await repository.find({
      where: { user_id },
      relations: ['trades'],
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

  /**
   * 조회 가능한 저금통들을 조회합니다 (active = true)
   * @param user_id 사용자 ID (선택사항)
   * @returns 조회 가능한 저금통 배열
   */
  async findAvailableVaults(user_id?: number): Promise<SavingsVault[]> {
    const repository = await this.getSavingsVaultRepository();
    
    const queryBuilder = repository.createQueryBuilder('savings_vault')
      .leftJoinAndSelect('savings_vault.user', 'user')
      .leftJoinAndSelect('savings_vault.trades', 'trades')
      .where('savings_vault.active = :active', { active: true })
      .orderBy('savings_vault.created_at', 'DESC');
    
    if (user_id) {
      queryBuilder.andWhere('savings_vault.user_id = :user_id', { user_id });
    }
    
    return await queryBuilder.getMany();
  }

  /**
   * 사용자의 조회 가능한 저금통들을 조회합니다
   * @param user_id 사용자 ID
   * @returns 사용자의 조회 가능한 저금통 배열
   */
  async findAvailableVaultsByUser(user_id: number): Promise<SavingsVault[]> {
    return await this.findAvailableVaults(user_id);
  }

  /**
   * 모든 조회 가능한 저금통들을 조회합니다
   * @returns 모든 조회 가능한 저금통 배열
   */
  async findAllAvailableVaults(): Promise<SavingsVault[]> {
    return await this.findAvailableVaults();
  }

  /**
   * 저금통의 상세 정보와 관련 데이터를 조회합니다
   * @param vault_id 저금고 ID
   * @returns 저금통 상세 정보 (관련 거래, 입금 포함)
   */
  async findVaultWithDetails(vault_id: number): Promise<SavingsVault | null> {
    const repository = await this.getSavingsVaultRepository();
    return await repository.findOne({
      where: { vault_id },
      relations: ['user', 'trades'],
      order: {
        trades: { created_at: 'DESC' }
      }
    });
  }
}

export const savingsVaultService = new SavingsVaultService();
