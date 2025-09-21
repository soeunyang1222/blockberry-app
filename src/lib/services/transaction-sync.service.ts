import { suiRpcService, SuiTransactionBlock } from './sui-rpc.service';
import { tradeService, CreateTradeDto } from './trade.service';
import { userWalletService, UserWalletInfo } from './user-wallet.service';
import { Repository } from 'typeorm';
import { getDataSource } from '../database/connection';
import { Trade } from '../database/entities/trade.entity';

export interface TransactionSyncResult {
  totalProcessed: number;
  newTrades: number;
  skippedTrades: number;
  errors: string[];
  lastProcessedDigest?: string;
}

export class TransactionSyncService {
  private tradeRepository: Repository<Trade> | null = null;

  private async getTradeRepository(): Promise<Repository<Trade>> {
    if (!this.tradeRepository) {
      const dataSource = await getDataSource();
      this.tradeRepository = dataSource.getRepository(Trade);
    }
    return this.tradeRepository;
  }

  /**
   * 등록된 사용자들의 지갑 주소를 기반으로 트랜잭션을 동기화합니다
   * @param limit 각 지갑당 조회할 트랜잭션 수 (기본값: 50)
   * @returns 동기화 결과
   */
  async syncRecentTransactions(limit: number = 50): Promise<TransactionSyncResult> {
    const result: TransactionSyncResult = {
      totalProcessed: 0,
      newTrades: 0,
      skippedTrades: 0,
      errors: [],
    };

    try {
      console.log(`Starting transaction sync for registered users with limit: ${limit} per wallet`);
      
      // 등록된 사용자들의 지갑 주소 조회
      const userWallets = await userWalletService.getAllUserWallets();
      console.log(`Found ${userWallets.length} registered user wallets`);

      if (userWallets.length === 0) {
        console.log('No registered users found, skipping transaction sync');
        return result;
      }

      // 각 사용자 지갑에 대해 트랜잭션 조회 및 처리
      for (const userWallet of userWallets) {
        try {
          console.log(`Processing transactions for user ${userWallet.user_id} (${userWallet.wallet_address})`);
          
          // 해당 지갑 주소의 트랜잭션 조회
          const { data: transactions } = await suiRpcService.getTransactionBlocksByAddress(
            userWallet.wallet_address,
            limit
          );
          
          result.totalProcessed += transactions.length;
          console.log(`Fetched ${transactions.length} transactions for user ${userWallet.user_id}`);

          // 각 트랜잭션을 처리
          for (const transaction of transactions) {
            try {
              const processed = await this.processTransactionForUser(transaction, userWallet);
              if (processed) {
                result.newTrades++;
              } else {
                result.skippedTrades++;
              }
            } catch (error) {
              const errorMsg = `Error processing transaction ${transaction.digest} for user ${userWallet.user_id}: ${error instanceof Error ? error.message : String(error)}`;
              console.error(errorMsg);
              result.errors.push(errorMsg);
            }
          }

        } catch (error) {
          const errorMsg = `Error processing transactions for user ${userWallet.user_id}: ${error instanceof Error ? error.message : String(error)}`;
          console.error(errorMsg);
          result.errors.push(errorMsg);
        }
      }

      console.log(`Transaction sync completed: ${result.newTrades} new trades, ${result.skippedTrades} skipped, ${result.errors.length} errors`);
      
    } catch (error) {
      const errorMsg = `Failed to sync transactions: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      result.errors.push(errorMsg);
    }

    return result;
  }

  /**
   * 특정 사용자의 트랜잭션을 처리하여 거래 정보를 추출하고 DB에 저장합니다
   * @param transaction 트랜잭션 블록
   * @param userWallet 사용자 지갑 정보
   * @returns 거래가 새로 생성되었는지 여부
   */
  private async processTransactionForUser(transaction: SuiTransactionBlock, userWallet: UserWalletInfo): Promise<boolean> {
    try {
      // 트랜잭션 정보 추출
      const tradeInfo = suiRpcService.extractTradeInfo(transaction);
      
      // 성공한 트랜잭션만 처리
      if (!tradeInfo.isSuccess) {
        console.log(`Skipping failed transaction: ${transaction.digest}`);
        return false;
      }

      // 이미 존재하는 트랜잭션인지 확인
      const repository = await this.getTradeRepository();
      const existingTrade = await repository.findOne({
        where: { tx_hash: transaction.digest }
      });

      if (existingTrade) {
        console.log(`Transaction already exists: ${transaction.digest}`);
        return false;
      }

      // DeepBook 거래인지 확인하고 거래 정보 추출
      const tradeData = this.extractDeepBookTradeData(transaction, tradeInfo, userWallet);
      
      if (!tradeData) {
        console.log(`Not a DeepBook trade: ${transaction.digest}`);
        return false;
      }

      // 거래 데이터를 DB에 저장
      await this.saveTradeToDatabase(tradeData);
      console.log(`Saved new trade: ${transaction.digest} for user ${userWallet.user_id}`);
      
      return true;
      
    } catch (error) {
      console.error(`Error processing transaction ${transaction.digest}:`, error);
      throw error;
    }
  }

  /**
   * 시간 범위 동기화용 트랜잭션 처리 메서드
   * @param transaction 트랜잭션 블록
   * @returns 거래가 새로 생성되었는지 여부
   */
  async processTransactionForTimeRange(transaction: SuiTransactionBlock): Promise<boolean> {
    try {
      // 트랜잭션 정보 추출
      const tradeInfo = suiRpcService.extractTradeInfo(transaction);
      
      // 성공한 트랜잭션만 처리
      if (!tradeInfo.isSuccess) {
        console.log(`Skipping failed transaction: ${transaction.digest}`);
        return false;
      }

      // 이미 존재하는 트랜잭션인지 확인
      const repository = await this.getTradeRepository();
      const existingTrade = await repository.findOne({
        where: { tx_hash: transaction.digest }
      });

      if (existingTrade) {
        console.log(`Transaction already exists: ${transaction.digest}`);
        return false;
      }

      // DeepBook 거래인지 확인하고 거래 정보 추출
      const tradeData = this.extractDeepBookTradeDataForTimeRange(transaction, tradeInfo);
      
      if (!tradeData) {
        console.log(`Not a DeepBook trade: ${transaction.digest}`);
        return false;
      }

      // 거래 데이터를 DB에 저장
      await this.saveTradeToDatabase(tradeData);
      console.log(`Saved new trade: ${transaction.digest}`);
      
      return true;
      
    } catch (error) {
      console.error(`Error processing transaction ${transaction.digest}:`, error);
      throw error;
    }
  }

  /**
   * DeepBook 트랜잭션에서 거래 데이터를 추출합니다
   * @param transaction 트랜잭션 블록
   * @param tradeInfo 추출된 거래 정보
   * @param userWallet 사용자 지갑 정보
   * @returns 거래 데이터 또는 null
   */
  private extractDeepBookTradeData(
    transaction: SuiTransactionBlock,
    tradeInfo: any,
    userWallet: UserWalletInfo
  ): CreateTradeDto | null {
    try {
      // DeepBook 관련 이벤트 찾기
      const deepBookEvents = tradeInfo.events.filter((event: any) => 
        event.type.includes('deepbook') || 
        event.type.includes('TradeFilled') ||
        event.type.includes('OrderFilled')
      );

      if (deepBookEvents.length === 0) {
        return null;
      }

      // 첫 번째 DeepBook 이벤트에서 거래 정보 추출
      const tradeEvent = deepBookEvents[0];
      
      // 기본값 설정 (실제 구현에서는 이벤트 데이터를 파싱하여 정확한 값 추출)
      const tradeData: CreateTradeDto = {
        vault_id: 1, // TODO: 사용자의 활성 저금고 ID 매핑 로직 필요
        user_id: userWallet.user_id, // 실제 사용자 ID 사용
        fiat_amount: 100, // TODO: 실제 이벤트에서 추출
        fiat_symbol: 'USDC',
        token_symbol: 'SUI', // TODO: 실제 이벤트에서 추출
        token_amount: 10, // TODO: 실제 이벤트에서 추출
        price_executed: 0.1, // TODO: 실제 이벤트에서 추출
        tx_hash: transaction.digest,
        cycle_index: 1, // TODO: 실제 사이클 인덱스 계산
      };

      // TODO: 실제 이벤트 데이터 파싱 로직 구현
      // tradeEvent.parsedJson에서 실제 거래 정보 추출
      console.log('DeepBook trade event:', tradeEvent);

      return tradeData;
      
    } catch (error) {
      console.error('Error extracting DeepBook trade data:', error);
      return null;
    }
  }

  /**
   * 시간 범위 동기화용 DeepBook 트랜잭션에서 거래 데이터를 추출합니다
   * @param transaction 트랜잭션 블록
   * @param tradeInfo 추출된 거래 정보
   * @returns 거래 데이터 또는 null
   */
  private extractDeepBookTradeDataForTimeRange(
    transaction: SuiTransactionBlock,
    tradeInfo: any
  ): CreateTradeDto | null {
    try {
      // DeepBook 관련 이벤트 찾기
      const deepBookEvents = tradeInfo.events.filter((event: any) => 
        event.type.includes('deepbook') || 
        event.type.includes('TradeFilled') ||
        event.type.includes('OrderFilled')
      );

      if (deepBookEvents.length === 0) {
        return null;
      }

      // 첫 번째 DeepBook 이벤트에서 거래 정보 추출
      const tradeEvent = deepBookEvents[0];
      
      // 기본값 설정 (시간 범위 동기화에서는 사용자 정보 없이 처리)
      const tradeData: CreateTradeDto = {
        vault_id: 1, // TODO: 기본 저금고 ID 또는 동적 매핑
        user_id: 1,  // TODO: 트랜잭션에서 사용자 정보 추출 또는 기본값
        fiat_amount: 100, // TODO: 실제 이벤트에서 추출
        fiat_symbol: 'USDC',
        token_symbol: 'SUI', // TODO: 실제 이벤트에서 추출
        token_amount: 10, // TODO: 실제 이벤트에서 추출
        price_executed: 0.1, // TODO: 실제 이벤트에서 추출
        tx_hash: transaction.digest,
        cycle_index: 1, // TODO: 실제 사이클 인덱스 계산
      };

      // TODO: 실제 이벤트 데이터 파싱 로직 구현
      // tradeEvent.parsedJson에서 실제 거래 정보 추출
      console.log('DeepBook trade event (time range):', tradeEvent);

      return tradeData;
      
    } catch (error) {
      console.error('Error extracting DeepBook trade data for time range:', error);
      return null;
    }
  }

  /**
   * 거래 데이터를 데이터베이스에 저장합니다
   * @param tradeData 거래 데이터
   */
  private async saveTradeToDatabase(tradeData: CreateTradeDto): Promise<void> {
    try {
      await tradeService.create(tradeData);
    } catch (error) {
      console.error('Error saving trade to database:', error);
      throw error;
    }
  }

  /**
   * 마지막으로 처리된 트랜잭션 다이제스트를 가져옵니다
   * @returns 마지막 처리된 트랜잭션 다이제스트
   */
  async getLastProcessedDigest(): Promise<string | null> {
    try {
      const repository = await this.getTradeRepository();
      const lastTrade = await repository.findOne({
        order: { created_at: 'DESC' }
      });
      
      return lastTrade?.tx_hash || null;
    } catch (error) {
      console.error('Error getting last processed digest:', error);
      return null;
    }
  }

  /**
   * 특정 기간의 트랜잭션들을 동기화합니다
   * @param startTime 시작 시간
   * @param endTime 종료 시간
   * @returns 동기화 결과
   */
  async syncTransactionsByTimeRange(
    startTime: Date,
    endTime: Date
  ): Promise<TransactionSyncResult> {
    const result: TransactionSyncResult = {
      totalProcessed: 0,
      newTrades: 0,
      skippedTrades: 0,
      errors: [],
    };

    try {
      console.log(`Syncing transactions from ${startTime.toISOString()} to ${endTime.toISOString()}`);
      
      let cursor: string | undefined;
      let hasMore = true;
      
      while (hasMore) {
        const { data: transactions, nextCursor, hasNextPage } = 
          await suiRpcService.getRecentTransactionBlocks(100, cursor);
        
        // 시간 범위에 맞는 트랜잭션만 필터링
        const filteredTransactions = transactions.filter(tx => {
          if (!tx.timestampMs) return false;
          const txTime = new Date(parseInt(tx.timestampMs));
          return txTime >= startTime && txTime <= endTime;
        });

        // 각 트랜잭션 처리 (시간 범위 동기화는 일반적인 처리 방식 사용)
        for (const transaction of filteredTransactions) {
          try {
            // 시간 범위 동기화에서는 사용자 정보 없이 처리
            const processed = await this.processTransactionForTimeRange(transaction);
            if (processed) {
              result.newTrades++;
            } else {
              result.skippedTrades++;
            }
            result.totalProcessed++;
          } catch (error) {
            const errorMsg = `Error processing transaction ${transaction.digest}: ${error instanceof Error ? error.message : String(error)}`;
            console.error(errorMsg);
            result.errors.push(errorMsg);
          }
        }

        cursor = nextCursor;
        hasMore = hasNextPage;
        
        // 시간 범위를 벗어나면 중단
        if (transactions.length > 0 && transactions[0].timestampMs) {
          const latestTxTime = new Date(parseInt(transactions[0].timestampMs));
          if (latestTxTime < startTime) {
            hasMore = false;
          }
        }
      }

      console.log(`Time range sync completed: ${result.newTrades} new trades, ${result.skippedTrades} skipped, ${result.errors.length} errors`);
      
    } catch (error) {
      const errorMsg = `Failed to sync transactions by time range: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      result.errors.push(errorMsg);
    }

    return result;
  }
}

export const transactionSyncService = new TransactionSyncService();
