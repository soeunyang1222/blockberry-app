import { NextRequest, NextResponse } from 'next/server';
import { DeepBookMarketMaker, BalanceManagerConfig } from '@/lib/deepbook/DeepBookMarketMaker';

/**
 * @swagger
 * /api/dca/trade/execute:
 *   post:
 *     tags: [DCA]
 *     summary: 거래 실행
 *     description: DeepBook V3에서 시장가 주문을 실행합니다
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balanceManagerId
 *               - tradeCapId
 *               - poolKey
 *               - amount
 *             properties:
 *               balanceManagerId:
 *                 type: string
 *                 description: Balance Manager ID
 *               tradeCapId:
 *                 type: string
 *                 description: Trade Cap ID
 *               poolKey:
 *                 type: string
 *                 description: Pool key for trading pair like SUI_USDC
 *               amount:
 *                 type: number
 *                 description: 거래할 금액
 *     responses:
 *       200:
 *         description: 거래 실행 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionDigest:
 *                       type: string
 *                     status:
 *                       type: string
 *                     poolKey:
 *                       type: string
 *                     amount:
 *                       type: number
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { balanceManagerId, tradeCapId, poolKey, amount } = body;

    if (!balanceManagerId || !tradeCapId || !poolKey || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'balanceManagerId, tradeCapId, poolKey, and amount are required'
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if platform private key is configured
    if (!process.env.PLATFORM_PRIVATE_KEY) {
      return NextResponse.json(
        { success: false, error: 'Platform private key not configured' },
        { status: 500 }
      );
    }

    // Initialize DeepBook client with balance manager config
    const env = process.env.NEXT_PUBLIC_ENV as "testnet" | "mainnet" || "testnet";
    const balanceManagers: Record<string, BalanceManagerConfig> = {
      MANAGER_1: {
        address: balanceManagerId,
        tradeCap: tradeCapId,
      }
    };

    const deepbookMM = new DeepBookMarketMaker(
      process.env.PLATFORM_PRIVATE_KEY,
      env,
      balanceManagers
    );

    // Execute market order
    const result = await deepbookMM.executeMarketOrder(poolKey, 'MANAGER_1', amount);

    // TODO: Record trade in database

    return NextResponse.json({
      success: true,
      data: {
        transactionDigest: result.digest,
        status: result.effects?.status?.status || 'unknown',
        poolKey,
        amount,
        message: 'Trade executed successfully',
      }
    });

  } catch (error: any) {
    console.error('Error executing trade:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute trade' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/dca/trade/history:
 *   get:
 *     tags: [DCA]
 *     summary: 거래 내역 조회
 *     description: 사용자의 DCA 거래 내역을 조회합니다
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: 사용자 ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: 조회할 거래 수
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           default: 0
 *         description: 건너뛸 거래 수
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     trades:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           transactionDigest:
 *                             type: string
 *                           poolKey:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           status:
 *                             type: string
 *                           executedAt:
 *                             type: string
 *                     total:
 *                       type: number
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch trades from database
    // For now, return mock data
    const mockTrades = [
      {
        id: 1,
        transactionDigest: '0xabc...123',
        poolKey: 'SUI_USDC',
        amount: 100,
        status: 'success',
        executedAt: new Date().toISOString(),
      },
      {
        id: 2,
        transactionDigest: '0xdef...456',
        poolKey: 'SUI_USDC',
        amount: 100,
        status: 'success',
        executedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        trades: mockTrades.slice(offset, offset + limit),
        total: mockTrades.length,
        limit,
        offset,
      }
    });

  } catch (error: any) {
    console.error('Error fetching trade history:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch trade history' },
      { status: 500 }
    );
  }
}