import { NextRequest, NextResponse } from 'next/server';
import { tradeService } from '@/lib/services/trade.service';
import { z } from 'zod';

const CreateTradeSchema = z.object({
  vault_id: z.number().positive('Vault ID must be positive'),
  user_id: z.number().positive('User ID must be positive'),
  fiat_amount: z.number().positive('Fiat amount must be positive'),
  fiat_symbol: z.string().min(1, 'Fiat symbol is required'),
  token_symbol: z.string().min(1, 'Token symbol is required'),
  token_amount: z.number().positive('Token amount must be positive'),
  price_executed: z.number().positive('Price executed must be positive'),
  tx_hash: z.string().min(1, 'Transaction hash is required'),
});

/**
 * @swagger
 * /api/trades:
 *   get:
 *     tags: [Trades]
 *     summary: 모든 거래 내역 조회
 *     description: 등록된 모든 거래 내역을 조회합니다.
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trade'
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const vault_id = searchParams.get('vault_id');

    let trades;
    if (user_id) {
      trades = await tradeService.findByUserId(parseInt(user_id));
    } else if (vault_id) {
      trades = await tradeService.findByVaultId(parseInt(vault_id));
    } else {
      trades = await tradeService.findAll();
    }

    return NextResponse.json({
      success: true,
      data: trades,
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trades',
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/trades:
 *   post:
 *     tags: [Trades]
 *     summary: 거래 생성
 *     description: 새로운 거래를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vault_id
 *               - user_id
 *               - fiat_amount
 *               - fiat_symbol
 *               - token_symbol
 *               - token_amount
 *               - price_executed
 *               - tx_hash
 *             properties:
 *               vault_id:
 *                 type: integer
 *                 description: 저금고 ID
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *               fiat_amount:
 *                 type: integer
 *                 description: 법정화폐 금액
 *                 example: 100000
 *               fiat_symbol:
 *                 type: string
 *                 description: 법정화폐 심볼
 *                 example: "KRW"
 *               token_symbol:
 *                 type: string
 *                 description: 토큰 심볼
 *                 example: "BTC"
 *               token_amount:
 *                 type: number
 *                 description: 토큰 금액
 *                 example: 0.001
 *               price_executed:
 *                 type: integer
 *                 description: 실행 가격
 *                 example: 100000000
 *               tx_hash:
 *                 type: string
 *                 description: 트랜잭션 해시
 *                 example: "0xabcdef..."
 *     responses:
 *       201:
 *         description: 거래 생성 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 데이터 검증
    const validatedData = CreateTradeSchema.parse(body);
    
    const trade = await tradeService.create(validatedData);
    
    return NextResponse.json(
      {
        success: true,
        data: trade,
        message: 'Trade created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating trade:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create trade',
      },
      { status: 500 }
    );
  }
}
