import { NextRequest, NextResponse } from 'next/server';
import { tradeService } from '@/lib/services/trade.service';

/**
 * @swagger
 * /api/trades/recent:
 *   get:
 *     tags: [Trades]
 *     summary: 최근 거래내역 조회
 *     description: 최근 거래내역을 조회합니다. 사용자별, 저금고별 필터링이 가능합니다.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 사용자 ID로 필터링
 *       - in: query
 *         name: vault_id
 *         schema:
 *           type: integer
 *         description: 저금고 ID로 필터링
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 가져올 거래 수 (기본값: 10)
 *     responses:
 *       200:
 *         description: 최근 거래내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trade'
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const vault_id = searchParams.get('vault_id');
    const limit = searchParams.get('limit');

    const limitNum = limit ? parseInt(limit) : 10;
    
    if (limitNum <= 0 || limitNum > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Limit must be between 1 and 100',
        },
        { status: 400 }
      );
    }

    let trades;
    
    if (user_id) {
      const userId = parseInt(user_id);
      if (isNaN(userId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid user_id',
          },
          { status: 400 }
        );
      }
      trades = await tradeService.getRecentTradesByUser(userId, limitNum);
    } else if (vault_id) {
      const vaultId = parseInt(vault_id);
      if (isNaN(vaultId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid vault_id',
          },
          { status: 400 }
        );
      }
      trades = await tradeService.getRecentTradesByVault(vaultId, limitNum);
    } else {
      trades = await tradeService.getRecentTrades(undefined, undefined, limitNum);
    }

    return NextResponse.json({
      success: true,
      data: trades,
      count: trades.length,
    });
  } catch (error) {
    console.error('Error fetching recent trades:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recent trades',
      },
      { status: 500 }
    );
  }
}
