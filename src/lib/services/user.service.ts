import { Repository } from 'typeorm';
import { getDataSource } from '../database/connection';
import { User } from '../database/entities/user.entity';

export interface CreateUserDto {
  wallet_address: string;
  virtual_account_address?: string;
}

export class UserService {
  private userRepository: Repository<User> | null = null;

  private async getUserRepository(): Promise<Repository<User>> {
    if (!this.userRepository) {
      const dataSource = await getDataSource();
      this.userRepository = dataSource.getRepository(User);
    }
    return this.userRepository;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const repository = await this.getUserRepository();
    const { wallet_address, virtual_account_address } = createUserDto;

    // 기존 사용자 확인
    const existingUser = await repository.findOne({
      where: { wallet_address },
    });

    if (existingUser) {
      throw new Error('User with this wallet address already exists');
    }

    const user = repository.create({
      wallet_address,
      virtual_account_address: virtual_account_address || undefined,
    });
    return await repository.save(user);
  }

  async findAll(): Promise<User[]> {
    const repository = await this.getUserRepository();
    return await repository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User | null> {
    const repository = await this.getUserRepository();
    return await repository.findOne({
      where: { id },
      relations: ['savings_vaults', 'trades'],
    });
  }

  async findByWalletAddress(wallet_address: string): Promise<User | null> {
    const repository = await this.getUserRepository();
    return await repository.findOne({
      where: { wallet_address },
      relations: ['savings_vaults', 'trades'],
    });
  }

  async remove(id: number): Promise<void> {
    const repository = await this.getUserRepository();
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    await repository.remove(user);
  }
}

export const userService = new UserService();
