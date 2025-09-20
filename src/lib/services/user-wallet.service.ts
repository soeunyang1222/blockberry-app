import { Repository } from 'typeorm';
import { getDataSource } from '../database/connection';
import { User } from '../database/entities/user.entity';

export interface UserWalletInfo {
  user_id: number;
  wallet_address: string;
  virtual_account_address?: string;
}

export class UserWalletService {
  private userRepository: Repository<User> | null = null;

  private async getUserRepository(): Promise<Repository<User>> {
    if (!this.userRepository) {
      const dataSource = await getDataSource();
      this.userRepository = dataSource.getRepository(User);
    }
    return this.userRepository;
  }

  /**
   * 등록된 모든 사용자의 지갑 주소 정보를 조회합니다
   * @returns 사용자 지갑 정보 배열
   */
  async getAllUserWallets(): Promise<UserWalletInfo[]> {
    try {
      const repository = await this.getUserRepository();
      const users = await repository.find({
        select: ['id', 'wallet_address', 'virtual_account_address'],
      });

      return users.map(user => ({
        user_id: user.id,
        wallet_address: user.wallet_address,
        virtual_account_address: user.virtual_account_address || undefined,
      }));
    } catch (error) {
      console.error('Error fetching user wallets:', error);
      throw new Error(`Failed to fetch user wallets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 특정 사용자의 지갑 주소 정보를 조회합니다
   * @param userId 사용자 ID
   * @returns 사용자 지갑 정보
   */
  async getUserWallet(userId: number): Promise<UserWalletInfo | null> {
    try {
      const repository = await this.getUserRepository();
      const user = await repository.findOne({
        where: { id: userId },
        select: ['id', 'wallet_address', 'virtual_account_address'],
      });

      if (!user) {
        return null;
      }

      return {
        user_id: user.id,
        wallet_address: user.wallet_address,
        virtual_account_address: user.virtual_account_address || undefined,
      };
    } catch (error) {
      console.error(`Error fetching user wallet for user ${userId}:`, error);
      throw new Error(`Failed to fetch user wallet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 지갑 주소로 사용자 정보를 조회합니다
   * @param walletAddress 지갑 주소
   * @returns 사용자 지갑 정보
   */
  async getUserByWalletAddress(walletAddress: string): Promise<UserWalletInfo | null> {
    try {
      const repository = await this.getUserRepository();
      const user = await repository.findOne({
        where: { wallet_address: walletAddress },
        select: ['id', 'wallet_address', 'virtual_account_address'],
      });

      if (!user) {
        return null;
      }

      return {
        user_id: user.id,
        wallet_address: user.wallet_address,
        virtual_account_address: user.virtual_account_address || undefined,
      };
    } catch (error) {
      console.error(`Error fetching user by wallet address ${walletAddress}:`, error);
      throw new Error(`Failed to fetch user by wallet address: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 활성 사용자들의 지갑 주소만 조회합니다 (최근 활동 기준)
   * @param days 최근 며칠간의 활동 기준 (기본값: 30일)
   * @returns 활성 사용자 지갑 정보 배열
   */
  async getActiveUserWallets(days: number = 30): Promise<UserWalletInfo[]> {
    try {
      const repository = await this.getUserRepository();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // 최근 활동이 있는 사용자들 조회 (trades 테이블과 조인)
      const activeUsers = await repository
        .createQueryBuilder('user')
        .leftJoin('user.trades', 'trade')
        .where('trade.created_at >= :cutoffDate', { cutoffDate })
        .orWhere('user.created_at >= :cutoffDate', { cutoffDate })
        .select(['user.id', 'user.wallet_address', 'user.virtual_account_address'])
        .distinct(true)
        .getMany();

      return activeUsers.map(user => ({
        user_id: user.id,
        wallet_address: user.wallet_address,
        virtual_account_address: user.virtual_account_address || undefined,
      }));
    } catch (error) {
      console.error('Error fetching active user wallets:', error);
      throw new Error(`Failed to fetch active user wallets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const userWalletService = new UserWalletService();
