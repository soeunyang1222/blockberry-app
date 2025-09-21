import { NextRequest, NextResponse } from 'next/server';

// Mock scheduler status
let schedulerJobs = [
  {
    id: 'price-update',
    name: 'Price Update Job',
    interval: '5 minutes',
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'dca-execution',
    name: 'DCA Execution Job',
    interval: 'hourly',
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: 'active'
  }
];

/**
 * 스케줄러 상태 조회
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'success',
      data: {
        isInitialized: true,
        jobs: schedulerJobs,
        uptime: process.uptime(),
      }
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to get scheduler status'
      },
      { status: 500 }
    );
  }
}

/**
 * 스케줄러 초기화 또는 작업 실행
 */
export async function POST(request: NextRequest) {
  try {
    const { action, jobId } = await request.json();

    if (action === 'initialize') {
      return NextResponse.json({
        status: 'success',
        message: 'Scheduler initialized successfully',
        data: { jobs: schedulerJobs }
      });
    }

    if (action === 'runJob' && jobId) {
      const job = schedulerJobs.find(j => j.id === jobId);
      if (job) {
        job.lastRun = new Date().toISOString();
        return NextResponse.json({
          status: 'success',
          message: `Job ${jobId} executed successfully`,
          data: job
        });
      }
    }

    return NextResponse.json(
      { status: 'error', message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in scheduler operation:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Scheduler operation failed'
      },
      { status: 500 }
    );
  }
}