import { initializeScheduler } from './init-scheduler';

/**
 * 서버 시작 시 실행되는 초기화 함수
 * Next.js API 라우트에서 호출됩니다
 */
export async function initializeServer(): Promise<void> {
  try {
    console.log('Initializing server...');
    
    // 스케줄러 초기화
    await initializeScheduler();
    
    console.log('Server initialization completed');
    
  } catch (error) {
    console.error('Failed to initialize server:', error);
    throw error;
  }
}

// 서버 초기화 상태
let isServerInitialized = false;

/**
 * 서버가 이미 초기화되었는지 확인
 */
export function isInitialized(): boolean {
  return isServerInitialized;
}

/**
 * 서버 초기화 상태를 설정
 */
export function setInitialized(status: boolean): void {
  isServerInitialized = status;
}
