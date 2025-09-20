import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SuiService } from '../sui/sui.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly suiService: SuiService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { wallet_address } = createUserDto;

    // 이미 존재하는 지갑 주소인지 확인
    const existingUser = await this.userRepository.findOne({
      where: { wallet_address },
    });

    if (existingUser) {
      throw new ConflictException('User with this wallet address already exists');
    }

    // Sui SDK로 지갑 주소 검증 및 정보 수집
    try {
      const accountInfo = await this.suiService.getAccountByHash(wallet_address);
      console.log(`Sui SDK response for ${wallet_address}:`, accountInfo);
    } catch (error) {
      console.warn(`Sui SDK validation failed for ${wallet_address}:`, error.message);
      // API 실패해도 사용자 생성은 진행 (선택적 검증)
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['savings_vaults', 'deposits', 'trades'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByWalletAddress(wallet_address: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { wallet_address },
      relations: ['savings_vaults', 'deposits', 'trades'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
