import { NextRequest, NextResponse } from 'next/server';
import { initializeScheduler, getSchedulerStatus, runManualSync } from '@/lib/init-scheduler';
import { initializeServer, isInitialized, setInitialized } from '@/lib/server-init';
import { suiRpcService } from '@/lib/services/sui-rpc.service';
import { transactionSyncService } from '@/lib/services/transaction-sync.service';

// 스케줄러 초기화 상태
let isSchedulerInitialized = false;

/**
 * 스케줄러 상태 조회
 */
export async function GET(request: NextRequest) {
  try {
    if (!isSchedulerInitialized) {
      return NextResponse.json({
        status: 'not_initialized',
        message: 'Scheduler is not initialized'
      });
    }

    const status = getSchedulerStatus();
    
    return NextResponse.json({
      status: 'success',
      data: status
    });
    
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

/**
 * 스케줄러 초기화 및 수동 동기화 실행
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, limit } = body;

    switch (action) {
      case 'initialize':
        if (!isSchedulerInitialized) {
          // 서버 초기화 (스케줄러 포함)
          await initializeServer();
          isSchedulerInitialized = true;
          setInitialized(true);
          
          return NextResponse.json({
            status: 'success',
            message: 'Server and scheduler initialized successfully'
          });
        } else {
          return NextResponse.json({
            status: 'already_initialized',
            message: 'Server and scheduler are already initialized'
          });
        }

      case 'manual_sync':
        if (!isSchedulerInitialized) {
          return NextResponse.json({
            status: 'error',
            message: 'Scheduler is not initialized'
          }, { status: 400 });
        }

        const result = await runManualSync(limit || 100);
        
        return NextResponse.json({
          status: 'success',
          message: 'Manual sync completed',
          data: result
        });

      case 'test_transaction':
        if (!isSchedulerInitialized) {
          return NextResponse.json({
            status: 'error',
            message: 'Scheduler is not initialized'
          }, { status: 400 });
        }

        const { tx_digest, save_to_db } = body;
        if (!tx_digest) {
          return NextResponse.json({
            status: 'error',
            message: 'Transaction digest is required'
          }, { status: 400 });
        }

        try {
          // 특정 트랜잭션 조회
          const transaction = await suiRpcService.getTransactionBlock(tx_digest);
          
          // 트랜잭션 정보 추출
          const tradeInfo = suiRpcService.extractTradeInfo(transaction);
          
          // DeepBook 거래인지 확인
          const deepBookEvents = tradeInfo.events.filter((event: any) => 
            event.type.includes('deepbook') || 
            event.type.includes('TradeFilled') ||
            event.type.includes('OrderFilled')
          );

          const testResult: any = {
            tx_digest,
            isSuccess: tradeInfo.isSuccess,
            timestamp: tradeInfo.timestamp,
            gasUsed: tradeInfo.gasUsed,
            events: tradeInfo.events,
            deepBookEvents,
            isDeepBookTrade: deepBookEvents.length > 0,
            eventDetails: deepBookEvents.length > 0 ? deepBookEvents[0] : null,
            savedToDb: false
          };

          // DB에 저장할지 여부 확인
          if (save_to_db === true && deepBookEvents.length > 0) {
            try {
              // 시간 범위 동기화 방식으로 처리 (사용자 정보 없이)
              const saved = await transactionSyncService.processTransactionForTimeRange(transaction);
              testResult.savedToDb = saved;
            } catch (dbError) {
              console.error('Error saving to database:', dbError);
              testResult.savedToDb = false;
              testResult.dbError = dbError instanceof Error ? dbError.message : String(dbError);
            }
          }

          return NextResponse.json({
            status: 'success',
            message: 'Transaction test completed',
            data: testResult
          });

        } catch (error) {
          return NextResponse.json({
            status: 'error',
            message: `Failed to test transaction: ${error instanceof Error ? error.message : String(error)}`
          }, { status: 500 });
        }

      default:
        return NextResponse.json({
          status: 'error',
          message: 'Invalid action'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error in scheduler API:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
