import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { normalizeSuiAddress } from '@mysten/sui/utils';

export interface SuiAccountInfo {
  address: string;
  balance: string;
  objects: any[];
  isValid: boolean;
}

export interface SuiBalance {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
  lockedBalance: Record<string, string>;
}

@Injectable()
export class SuiService {
  private readonly client: SuiClient;
  private readonly network: string;

  constructor(private readonly configService: ConfigService) {
    this.network = this.configService.get<string>('SUI_NETWORK', 'testnet');
    this.client = new SuiClient({ 
      url: getFullnodeUrl(this.network as any)
    });
  }

  /**
   * 지갑 주소 검증 및 계정 정보 조회
   */
  async getAccountByHash(address: string): Promise<SuiAccountInfo> {
    try {
      // 주소 정규화
      const normalizedAddress = normalizeSuiAddress(address);
      
      // 계정 정보 조회 (임시 구현)
      const accountInfo = {
        owner: normalizedAddress,
        data: {}
      };

      // SUI 잔액 조회
      const balance = await this.client.getBalance({
        owner: normalizedAddress,
        coinType: '0x2::sui::SUI'
      });

      // 소유한 객체들 조회
      const objects = await this.client.getOwnedObjects({
        owner: normalizedAddress,
        options: {
          showType: true,
          showContent: true,
          showDisplay: true,
        }
      });

      return {
        address: normalizedAddress,
        balance: balance.totalBalance,
        objects: objects.data,
        isValid: true
      };
    } catch (error) {
      console.error('Sui account validation failed:', error);
      throw new HttpException(
        `Invalid Sui address: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 특정 토큰 잔액 조회
   */
  async getTokenBalance(address: string, coinType: string): Promise<SuiBalance> {
    try {
      const normalizedAddress = normalizeSuiAddress(address);
      
      const balance = await this.client.getBalance({
        owner: normalizedAddress,
        coinType: coinType
      });

      return balance;
    } catch (error) {
      throw new HttpException(
        `Failed to get token balance: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * USDC 잔액 조회 (Sui Testnet USDC)
   */
  async getUSDCBalance(address: string): Promise<SuiBalance> {
    // Sui Testnet USDC 주소 (실제 주소로 변경 필요)
    const USDC_COIN_TYPE = '0x5d4b302506645c3ff4b2c70d70cb120acec5fa6742f315893216b743d5e1b596::usdc::USDC';
    return this.getTokenBalance(address, USDC_COIN_TYPE);
  }

  /**
   * BTC 잔액 조회 (Wrapped BTC)
   */
  async getBTCBalance(address: string): Promise<SuiBalance> {
    // Wrapped BTC 주소 (실제 주소로 변경 필요)
    const BTC_COIN_TYPE = '0x2::sui::SUI'; // 임시로 SUI 사용
    return this.getTokenBalance(address, BTC_COIN_TYPE);
  }

  /**
   * 트랜잭션 정보 조회
   */
  async getTransaction(txHash: string) {
    try {
      const transaction = await this.client.getTransactionBlock({
        digest: txHash,
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        }
      });

      return transaction;
    } catch (error) {
      throw new HttpException(
        `Failed to get transaction: ${error.message}`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  /**
   * 네트워크 정보 조회
   */
  async getNetworkInfo() {
    try {
      const chainId = await this.client.getChainIdentifier();
      return {
        network: this.network,
        chainId: chainId,
        rpcUrl: 'https://fullnode.testnet.sui.io:443'
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get network info: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 지갑 주소 유효성 검증
   */
  async validateAddress(address: string): Promise<boolean> {
    try {
      const normalizedAddress = normalizeSuiAddress(address);
      // 임시 구현 - 주소 유효성 검증
      const isValid = normalizedAddress.length === 66 && normalizedAddress.startsWith('0x');
      return true;
    } catch (error) {
      return false;
    }
  }
}
