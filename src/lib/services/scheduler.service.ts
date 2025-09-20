import * as cron from 'node-cron';
import { transactionSyncService, TransactionSyncResult } from './transaction-sync.service';

export class SchedulerService {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private isRunning: boolean = false;

  /**
   * 스케줄러를 시작합니다
   */
  start(): void {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log('Starting transaction sync scheduler...');
    this.isRunning = true;

    // 10분마다 트랜잭션 동기화 실행 (웹사이트에 적합한 주기)
    this.scheduleTransactionSync('*/10 * * * *', 'transaction-sync-10min');
    
    // 1시간마다 더 많은 트랜잭션 동기화 실행
    this.scheduleTransactionSync('0 * * * *', 'transaction-sync-1hour');
    
    // 매일 새벽 2시에 전체 동기화 실행 (트래픽이 적은 시간)
    this.scheduleTransactionSync('0 2 * * *', 'transaction-sync-daily');

    console.log('Transaction sync scheduler started successfully');
  }

  /**
   * 스케줄러를 중지합니다
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Scheduler is not running');
      return;
    }

    console.log('Stopping transaction sync scheduler...');
    
    // 모든 스케줄된 작업 중지
    this.tasks.forEach((task, name) => {
      task.stop();
      console.log(`Stopped scheduled task: ${name}`);
    });
    
    this.tasks.clear();
    this.isRunning = false;
    
    console.log('Transaction sync scheduler stopped');
  }

  /**
   * 트랜잭션 동기화 작업을 스케줄합니다
   * @param cronExpression Cron 표현식
   * @param taskName 작업 이름
   */
  private scheduleTransactionSync(cronExpression: string, taskName: string): void {
    const task = cron.schedule(cronExpression, async () => {
      console.log(`Starting scheduled transaction sync: ${taskName}`);
      
      try {
        const startTime = new Date();
        const result = await this.executeTransactionSync(taskName);
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        
        console.log(`Scheduled transaction sync completed: ${taskName}`);
        console.log(`Duration: ${duration}ms`);
        console.log(`Result:`, {
          totalProcessed: result.totalProcessed,
          newTrades: result.newTrades,
          skippedTrades: result.skippedTrades,
          errors: result.errors.length,
        });
        
        // 에러가 있으면 로그 출력
        if (result.errors.length > 0) {
          console.error(`Errors in ${taskName}:`, result.errors);
        }
        
      } catch (error) {
        console.error(`Error in scheduled transaction sync ${taskName}:`, error);
      }
    }, {
      scheduled: false, // 수동으로 시작
      timezone: 'Asia/Seoul', // 한국 시간대
    });

    this.tasks.set(taskName, task);
    task.start();
    
    console.log(`Scheduled transaction sync task: ${taskName} (${cronExpression})`);
  }

  /**
   * 트랜잭션 동기화를 실행합니다
   * @param taskName 작업 이름
   * @returns 동기화 결과
   */
  private async executeTransactionSync(taskName: string): Promise<TransactionSyncResult> {
    try {
      let limit = 50; // 기본값
      
      // 작업 유형에 따라 다른 제한값 설정
      if (taskName.includes('10min')) {
        limit = 20; // 10분마다는 적은 양만 조회
      } else if (taskName.includes('1hour')) {
        limit = 100; // 1시간마다는 중간 양 조회
      } else if (taskName.includes('daily')) {
        limit = 500; // 매일은 많은 양 조회
      }
      
      console.log(`Executing transaction sync with limit: ${limit}`);
      return await transactionSyncService.syncRecentTransactions(limit);
      
    } catch (error) {
      console.error(`Error executing transaction sync for ${taskName}:`, error);
      throw error;
    }
  }

  /**
   * 수동으로 트랜잭션 동기화를 실행합니다
   * @param limit 조회할 트랜잭션 수
   * @returns 동기화 결과
   */
  async runManualSync(limit: number = 100): Promise<TransactionSyncResult> {
    console.log(`Running manual transaction sync with limit: ${limit}`);
    
    try {
      const startTime = new Date();
      const result = await transactionSyncService.syncRecentTransactions(limit);
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      console.log(`Manual transaction sync completed in ${duration}ms`);
      console.log(`Result:`, {
        totalProcessed: result.totalProcessed,
        newTrades: result.newTrades,
        skippedTrades: result.skippedTrades,
        errors: result.errors.length,
      });
      
      return result;
      
    } catch (error) {
      console.error('Error in manual transaction sync:', error);
      throw error;
    }
  }

  /**
   * 특정 기간의 트랜잭션을 수동으로 동기화합니다
   * @param startTime 시작 시간
   * @param endTime 종료 시간
   * @returns 동기화 결과
   */
  async runManualSyncByTimeRange(
    startTime: Date,
    endTime: Date
  ): Promise<TransactionSyncResult> {
    console.log(`Running manual transaction sync for time range: ${startTime.toISOString()} to ${endTime.toISOString()}`);
    
    try {
      const start = new Date();
      const result = await transactionSyncService.syncTransactionsByTimeRange(startTime, endTime);
      const end = new Date();
      const duration = end.getTime() - start.getTime();
      
      console.log(`Manual time range sync completed in ${duration}ms`);
      console.log(`Result:`, {
        totalProcessed: result.totalProcessed,
        newTrades: result.newTrades,
        skippedTrades: result.skippedTrades,
        errors: result.errors.length,
      });
      
      return result;
      
    } catch (error) {
      console.error('Error in manual time range sync:', error);
      throw error;
    }
  }

  /**
   * 스케줄러 상태를 가져옵니다
   * @returns 스케줄러 상태 정보
   */
  getStatus(): {
    isRunning: boolean;
    tasks: Array<{
      name: string;
      isRunning: boolean;
    }>;
  } {
    const tasks = Array.from(this.tasks.entries()).map(([name, task]) => ({
      name,
      isRunning: task.getStatus() === 'scheduled',
    }));

    return {
      isRunning: this.isRunning,
      tasks,
    };
  }

  /**
   * 특정 작업을 일시 중지합니다
   * @param taskName 작업 이름
   */
  pauseTask(taskName: string): void {
    const task = this.tasks.get(taskName);
    if (task) {
      task.stop();
      console.log(`Paused scheduled task: ${taskName}`);
    } else {
      console.log(`Task not found: ${taskName}`);
    }
  }

  /**
   * 특정 작업을 재시작합니다
   * @param taskName 작업 이름
   */
  resumeTask(taskName: string): void {
    const task = this.tasks.get(taskName);
    if (task) {
      task.start();
      console.log(`Resumed scheduled task: ${taskName}`);
    } else {
      console.log(`Task not found: ${taskName}`);
    }
  }
}

export const schedulerService = new SchedulerService();
