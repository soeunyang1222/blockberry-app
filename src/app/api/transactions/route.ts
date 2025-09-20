import { NextRequest, NextResponse } from 'next/server';
import { depositService } from '@/lib/services/deposit.service';
import { tradeService } from '@/lib/services/trade.service';

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: 통합 거래 내역 조회
 *     description: 입금과 거래 내역을 통합하여 조회합니다.
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, trade]
 *         description: 거래 타입으로 필터링
 *     responses:
 *       200:
 *         description: 거래 내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           type:
 *                             type: string
 *                             enum: [deposit, trade]
 *                           amount:
 *                             type: integer
 *                           symbol:
 *                             type: string
 *                           tx_hash:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           vault_id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                     total_count:
 *                       type: integer
 *                       description: 총 거래 수
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const vault_id = searchParams.get('vault_id');
    const type = searchParams.get('type');

    const transactions: any[] = [];
    
    // 입금 내역 조회
    if (type === 'deposit' || !type) {
      let deposits = [];
      if (user_id) {
        deposits = await depositService.findByUserId(parseInt(user_id));
      } else if (vault_id) {
        deposits = await depositService.findByVaultId(parseInt(vault_id));
      } else {
        deposits = await depositService.findAll();
      }
      
      transactions.push(...deposits.map(deposit => ({
        id: deposit.deposit_id,
        type: 'deposit',
        amount: deposit.amount_fiat,
        symbol: deposit.fiat_symbol,
        tx_hash: deposit.tx_hash,
        created_at: deposit.created_at,
        vault_id: deposit.vault_id,
        user_id: deposit.user_id,
      })));
    }
    
    // 거래 내역 조회
    if (type === 'trade' || !type) {
      let trades = [];
      if (user_id) {
        trades = await tradeService.findByUserId(parseInt(user_id));
      } else if (vault_id) {
        trades = await tradeService.findByVaultId(parseInt(vault_id));
      } else {
        trades = await tradeService.findAll();
      }
      
      transactions.push(...trades.map(trade => ({
        id: trade.trade_id,
        type: 'trade',
        fiat_amount: trade.fiat_amount,
        fiat_symbol: trade.fiat_symbol,
        token_amount: trade.token_amount,
        token_symbol: trade.token_symbol,
        price_executed: trade.price_executed,
        tx_hash: trade.tx_hash,
        created_at: trade.created_at,
        vault_id: trade.vault_id,
        user_id: trade.user_id,
      })));
    }
    
    // 생성일시 기준으로 정렬
    transactions.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    
    return NextResponse.json({
      success: true,
      data: {
        transactions,
        total_count: transactions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions',
      },
      { status: 500 }
    );
  }
}
