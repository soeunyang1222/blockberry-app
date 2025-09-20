import { NextRequest, NextResponse } from 'next/server';
import { depositService } from '@/lib/services/deposit.service';

interface RouteParams {
  params: {
    deposit_id: string;
  };
}

/**
 * @swagger
 * /api/deposits/{deposit_id}:
 *   get:
 *     tags: [Deposits]
 *     summary: 입금 상세 조회
 *     description: 특정 입금의 상세 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: deposit_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 입금 ID
 *     responses:
 *       200:
 *         description: 입금 정보 조회 성공
 *       404:
 *         description: 입금을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const deposit_id = parseInt(params.deposit_id);
    
    if (isNaN(deposit_id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid deposit ID',
        },
        { status: 400 }
      );
    }
    
    const deposit = await depositService.findOne(deposit_id);
    
    if (!deposit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Deposit not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: deposit,
    });
  } catch (error) {
    console.error('Error fetching deposit:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch deposit',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const deposit_id = parseInt(params.deposit_id);
    
    if (isNaN(deposit_id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid deposit ID',
        },
        { status: 400 }
      );
    }
    
    await depositService.remove(deposit_id);
    
    return NextResponse.json({
      success: true,
      message: 'Deposit deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting deposit:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Deposit not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete deposit',
      },
      { status: 500 }
    );
  }
}
