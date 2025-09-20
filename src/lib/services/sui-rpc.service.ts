import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

export interface SuiTransactionBlock {
  digest: string;
  timestampMs?: string;
  transaction?: {
    data: {
      messageVersion: string;
      transaction: {
        inputs: any[];
        kind: {
          ProgrammableTransaction?: {
            inputs: any[];
            transactions: any[];
          };
        };
      };
    };
  };
  effects?: {
    status: {
      status: string;
    };
    gasUsed: {
      computationCost: string;
      storageCost: string;
      storageRebate: string;
    };
  };
  events?: any[];
}

export interface SuiTransactionQuery {
  filter?: {
    FromAddress?: string;
    ToAddress?: string;
    InputObject?: string;
    ChangedObject?: string;
    TransactionKind?: string;
    Function?: string;
    Package?: string;
    Module?: string;
  };
  options?: {
    showInput?: boolean;
    showEffects?: boolean;
    showEvents?: boolean;
    showObjectChanges?: boolean;
    showBalanceChanges?: boolean;
  };
}

export class SuiRpcService {
  private client: SuiClient;
  private readonly SUI_RPC_URL: string;

  constructor() {
    // Sui 테스트넷 RPC URL 사용 (메인넷으로 변경 가능)
    this.SUI_RPC_URL = process.env.SUI_RPC_URL || getFullnodeUrl('testnet');
    this.client = new SuiClient({ url: this.SUI_RPC_URL });
  }

  /**
   * 최근 트랜잭션 블록들을 조회합니다
   * @param limit 조회할 트랜잭션 수 (기본값: 50)
   * @param cursor 페이지네이션을 위한 커서
   * @returns 트랜잭션 블록 배열
   */
  async getRecentTransactionBlocks(
    limit: number = 50,
    cursor?: string
  ): Promise<{
    data: SuiTransactionBlock[];
    nextCursor?: string;
    hasNextPage: boolean;
  }> {
    try {
      const result = await this.client.queryTransactionBlocks({
        filter: undefined, // 모든 트랜잭션 조회
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        },
        limit,
        cursor,
        order: 'descending', // 최신 순으로 정렬
      });

      return {
        data: result.data as SuiTransactionBlock[],
        nextCursor: result.nextCursor || undefined,
        hasNextPage: result.hasNextPage,
      };
    } catch (error) {
      console.error('Error fetching recent transaction blocks:', error);
      throw new Error(`Failed to fetch transaction blocks: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 특정 트랜잭션 블록의 상세 정보를 조회합니다
   * @param digest 트랜잭션 다이제스트
   * @returns 트랜잭션 블록 상세 정보
   */
  async getTransactionBlock(digest: string): Promise<SuiTransactionBlock> {
    try {
      const result = await this.client.getTransactionBlock({
        digest,
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        },
      });

      return result as SuiTransactionBlock;
    } catch (error) {
      console.error(`Error fetching transaction block ${digest}:`, error);
      throw new Error(`Failed to fetch transaction block: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 특정 주소의 트랜잭션들을 조회합니다
   * @param address 주소
   * @param limit 조회할 트랜잭션 수 (기본값: 50)
   * @param cursor 페이지네이션을 위한 커서
   * @returns 트랜잭션 블록 배열
   */
  async getTransactionBlocksByAddress(
    address: string,
    limit: number = 50,
    cursor?: string
  ): Promise<{
    data: SuiTransactionBlock[];
    nextCursor?: string;
    hasNextPage: boolean;
  }> {
    try {
      const result = await this.client.queryTransactionBlocks({
        filter: {
          FromAddress: address,
        },
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        },
        limit,
        cursor,
        order: 'descending',
      });

      return {
        data: result.data as SuiTransactionBlock[],
        nextCursor: result.nextCursor || undefined,
        hasNextPage: result.hasNextPage,
      };
    } catch (error) {
      console.error(`Error fetching transaction blocks for address ${address}:`, error);
      throw new Error(`Failed to fetch transaction blocks for address: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * DeepBook 관련 트랜잭션들을 조회합니다
   * @param limit 조회할 트랜잭션 수 (기본값: 50)
   * @param cursor 페이지네이션을 위한 커서
   * @returns DeepBook 트랜잭션 블록 배열
   */
  async getDeepBookTransactions(
    limit: number = 50,
    cursor?: string
  ): Promise<{
    data: SuiTransactionBlock[];
    nextCursor?: string;
    hasNextPage: boolean;
  }> {
    try {
      const result = await this.client.queryTransactionBlocks({
        filter: undefined, // 모든 트랜잭션 조회
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        },
        limit,
        cursor,
        order: 'descending',
      });

      return {
        data: result.data as SuiTransactionBlock[],
        nextCursor: result.nextCursor || undefined,
        hasNextPage: result.hasNextPage,
      };
    } catch (error) {
      console.error('Error fetching DeepBook transactions:', error);
      throw new Error(`Failed to fetch DeepBook transactions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 트랜잭션에서 거래 정보를 추출합니다
   * @param transactionBlock 트랜잭션 블록
   * @returns 거래 정보 객체
   */
  extractTradeInfo(transactionBlock: SuiTransactionBlock): {
    txHash: string;
    timestamp: Date | null;
    isSuccess: boolean;
    gasUsed: string;
    events: any[];
    balanceChanges: any[];
  } {
    const timestamp = transactionBlock.timestampMs 
      ? new Date(parseInt(transactionBlock.timestampMs)) 
      : null;

    const isSuccess = transactionBlock.effects?.status?.status === 'success';
    
    const gasUsed = transactionBlock.effects?.gasUsed 
      ? (BigInt(transactionBlock.effects.gasUsed.computationCost) + 
         BigInt(transactionBlock.effects.gasUsed.storageCost) - 
         BigInt(transactionBlock.effects.gasUsed.storageRebate)).toString()
      : '0';

    return {
      txHash: transactionBlock.digest,
      timestamp,
      isSuccess,
      gasUsed,
      events: transactionBlock.events || [],
      balanceChanges: [], // TODO: balanceChanges 필드가 Sui SDK에서 제공되지 않음
    };
  }
}

export const suiRpcService = new SuiRpcService();
