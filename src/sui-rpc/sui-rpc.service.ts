import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface SuiRPCResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface CoinInfo {
  coinType: string;
  coinObjectId: string;
  version: string;
  digest: string;
  balance: string;
  previousTransaction: string;
}

export interface TransactionInfo {
  digest: string;
  timestampMs: string;
  effects: any;
  events: any[];
  objectChanges: any[];
  balanceChanges: any[];
}

export interface CoinQueryResult {
  data: CoinInfo[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

@Injectable()
export class SuiRPCService {
  private readonly rpcUrl: string;
  private readonly network: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.network = this.configService.get<string>('SUI_NETWORK', 'testnet');
    this.rpcUrl = this.getRPCUrl();
  }

  private getRPCUrl(): string {
    switch (this.network) {
      case 'mainnet':
        return 'https://fullnode.mainnet.sui.io:443';
      case 'testnet':
        return 'https://fullnode.testnet.sui.io:443';
      case 'devnet':
        return 'https://fullnode.devnet.sui.io:443';
      default:
        return 'https://fullnode.testnet.sui.io:443';
    }
  }

  /**
   * Sui JSON-RPC 직접 호출
   */
  private async callRPC<T = any>(
    method: string,
    params: any[] = []
  ): Promise<T> {
    try {
      const payload = {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      };

      const response = await firstValueFrom(
        this.httpService.post<SuiRPCResponse<T>>(this.rpcUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        })
      );

      if (response.data.error) {
        throw new Error(`RPC Error: ${response.data.error.message}`);
      }

      return response.data.result as T;
    } catch (error) {
      throw new HttpException(
        `Sui RPC call failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Coin Query API - 특정 주소의 코인 정보 조회
   */
  async getCoins(
    owner: string,
    coinType: string = '0x2::sui::SUI',
    cursor: string | null = null,
    limit: number = 10
  ): Promise<CoinQueryResult> {
    try {
      const params = [owner, coinType, cursor, limit];
      const result = await this.callRPC('suix_getCoins', params);
      
      return {
        data: result.data || [],
        nextCursor: result.nextCursor || null,
        hasNextPage: result.hasNextPage || false
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get coins: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 최근 거래 내역 10개 조회 (Coin Query 기반)
   */
  async getRecentTransactions(
    owner: string,
    limit: number = 10
  ): Promise<TransactionInfo[]> {
    try {
      // 1. 먼저 해당 주소의 모든 코인 정보 조회
      const coinsResult = await this.getCoins(owner, '0x2::sui::SUI', null, 50);
      
      // 2. 각 코인의 previousTransaction 해시 수집
      const transactionHashes = coinsResult.data
        .map(coin => coin.previousTransaction)
        .filter(hash => hash && hash !== '0x0000000000000000000000000000000000000000000000000000000000000000')
        .slice(0, limit);

      // 3. 각 트랜잭션의 상세 정보 조회
      const transactions: TransactionInfo[] = [];
      
      for (const txHash of transactionHashes) {
        try {
          const txInfo = await this.getTransaction(txHash);
          if (txInfo) {
            transactions.push(txInfo);
          }
        } catch (error) {
          console.warn(`Failed to get transaction ${txHash}:`, error.message);
        }
      }

      // 4. 타임스탬프 기준으로 정렬 (최신순)
      transactions.sort((a, b) => 
        parseInt(b.timestampMs) - parseInt(a.timestampMs)
      );

      return transactions.slice(0, limit);
    } catch (error) {
      throw new HttpException(
        `Failed to get recent transactions: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 특정 트랜잭션 상세 정보 조회
   */
  async getTransaction(txHash: string): Promise<TransactionInfo | null> {
    try {
      const result = await this.callRPC('sui_getTransactionBlock', [
        txHash,
        {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        }
      ]);

      return result as TransactionInfo;
    } catch (error) {
      console.warn(`Failed to get transaction ${txHash}:`, error.message);
      return null;
    }
  }

  /**
   * USDC 코인 정보 조회
   */
  async getUSDCCoins(
    owner: string,
    cursor: string | null = null,
    limit: number = 10
  ): Promise<CoinQueryResult> {
    const USDC_COIN_TYPE = '0x5d4b302506645c3ff4b2c70d70cb120acec5fa6742f315893216b743d5e1b596::usdc::USDC';
    return this.getCoins(owner, USDC_COIN_TYPE, cursor, limit);
  }

  /**
   * BTC 코인 정보 조회 (Wrapped BTC)
   */
  async getBTCCoins(
    owner: string,
    cursor: string | null = null,
    limit: number = 10
  ): Promise<CoinQueryResult> {
    // 실제 BTC 토큰 주소로 변경 필요
    const BTC_COIN_TYPE = '0x2::sui::SUI'; // 임시로 SUI 사용
    return this.getCoins(owner, BTC_COIN_TYPE, cursor, limit);
  }

  /**
   * 지갑 주소의 모든 코인 타입 조회
   */
  async getAllCoinTypes(owner: string): Promise<string[]> {
    try {
      const result = await this.callRPC('suix_getAllCoins', [owner]);
      const coinTypes = new Set<string>();
      
      if (result.data) {
        result.data.forEach((coin: CoinInfo) => {
          coinTypes.add(coin.coinType);
        });
      }
      
      return Array.from(coinTypes);
    } catch (error) {
      throw new HttpException(
        `Failed to get all coin types: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 코인 잔액 조회
   */
  async getBalance(
    owner: string,
    coinType: string = '0x2::sui::SUI'
  ): Promise<{
    coinType: string;
    coinObjectCount: number;
    totalBalance: string;
    lockedBalance: Record<string, string>;
  }> {
    try {
      const result = await this.callRPC('suix_getBalance', [owner, coinType]);
      return result;
    } catch (error) {
      throw new HttpException(
        `Failed to get balance: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 네트워크 정보 조회
   */
  async getNetworkInfo(): Promise<{
    network: string;
    rpcUrl: string;
    chainId: string;
    protocolVersion: string;
  }> {
    try {
      const chainId = await this.callRPC('sui_getChainIdentifier');
      const protocolVersion = await this.callRPC('sui_getProtocolConfig', ['1']);
      
      return {
        network: this.network,
        rpcUrl: this.rpcUrl,
        chainId: chainId,
        protocolVersion: protocolVersion.protocolVersion || 'unknown'
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get network info: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 최근 블록 정보 조회
   */
  async getLatestBlock(): Promise<{
    epoch: string;
    round: string;
    timestampMs: string;
    digest: string;
  }> {
    try {
      const result = await this.callRPC('sui_getLatestCheckpointSequenceNumber');
      const checkpoint = await this.callRPC('sui_getCheckpoint', [result]);
      
      return {
        epoch: checkpoint.epoch || '0',
        round: checkpoint.sequenceNumber || '0',
        timestampMs: checkpoint.timestampMs || '0',
        digest: checkpoint.digest || ''
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get latest block: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
