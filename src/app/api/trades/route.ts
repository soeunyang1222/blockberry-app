import { NextRequest, NextResponse } from 'next/server';
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
  cycle_index: z.number().positive('Cycle index must be positive'),
});

// Mock data
let mockTrades = [
  {
    id: 1,
    vault_id: 1,
    user_id: 1,
    fiat_amount: 100,
    fiat_symbol: 'USDC',
    token_symbol: 'WBTC',
    token_amount: 0.00105,
    price_executed: 95238.10,
    tx_hash: '0xabc123...',
    cycle_index: 1,
    created_at: new Date().toISOString(),
  }
];

/**
 * @swagger
 * /api/trades:
 *   get:
 *     tags: [Trades]
 *     summary: 거래 내역 조회
 *     description: 거래 내역을 조회합니다. 최근 거래내역 조회도 지원합니다.
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
 *         name: recent
 *         schema:
 *           type: boolean
 *         description: 최근 거래내역만 조회할지 여부 (true/false)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 최근 거래내역 조회 시 가져올 거래 수 (recent=true일 때만 적용)
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
    const recent = searchParams.get('recent');
    const limit = searchParams.get('limit');

    let trades = [...mockTrades];

    // Filter by user_id or vault_id
    if (user_id) {
      trades = trades.filter(t => t.user_id === parseInt(user_id));
    } else if (vault_id) {
      trades = trades.filter(t => t.vault_id === parseInt(vault_id));
    }

    // Sort by created_at desc
    trades.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Apply limit if recent
    if (recent === 'true') {
      const limitNum = limit ? parseInt(limit) : 10;
      trades = trades.slice(0, limitNum);
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
 *               - cycle_index
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
 *                 type: number
 *                 description: 법정화폐 금액
 *                 example: 1000.00
 *               fiat_symbol:
 *                 type: string
 *                 description: 법정화폐 심볼
 *                 example: "USDC"
 *               token_symbol:
 *                 type: string
 *                 description: 토큰 심볼
 *                 example: "BTC"
 *               token_amount:
 *                 type: number
 *                 description: 토큰 금액
 *                 example: 0.001
 *               price_executed:
 *                 type: number
 *                 description: 실행 가격
 *                 example: 100000.00
 *               tx_hash:
 *                 type: string
 *                 description: 트랜잭션 해시
 *                 example: "0xabcdef..."
 *               cycle_index:
 *                 type: integer
 *                 description: 거래 주기 인덱스
 *                 example: 1
 *     responses:
 *       201:
 *         description: 거래 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Trade'
 *                 message:
 *                   type: string
 *                   example: "Trade created successfully"
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

    const trade = {
      id: mockTrades.length + 1,
      ...validatedData,
      created_at: new Date().toISOString(),
    };

    mockTrades.push(trade);

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