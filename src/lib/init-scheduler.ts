import { schedulerService } from './services/scheduler.service';

/**
 * 애플리케이션 시작 시 스케줄러를 초기화합니다
 */
export async function initializeScheduler(): Promise<void> {
  try {
    console.log('Initializing transaction sync scheduler...');
    
    // 스케줄러 시작
    schedulerService.start();
    
    console.log('Transaction sync scheduler initialized successfully');
    
    // 애플리케이션 종료 시 스케줄러 정리
    process.on('SIGINT', () => {
      console.log('Received SIGINT, stopping scheduler...');
      schedulerService.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, stopping scheduler...');
      schedulerService.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to initialize scheduler:', error);
    throw error;
  }
}

/**
 * 스케줄러 상태를 확인합니다
 */
export function getSchedulerStatus() {
  return schedulerService.getStatus();
}

/**
 * 수동으로 트랜잭션 동기화를 실행합니다
 */
export async function runManualSync(limit?: number) {
  return await schedulerService.runManualSync(limit);
}
