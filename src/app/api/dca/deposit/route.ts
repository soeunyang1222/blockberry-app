import { NextRequest, NextResponse } from 'next/server';
import { DeepBookMarketMaker } from '@/lib/deepbook/DeepBookMarketMaker';

/**
 * @swagger
 * /api/dca/deposit:
 *   post:
 *     tags: [DCA]
 *     summary: Balance Manager에 USDC 예치
 *     description: DeepBook V3 Balance Manager에 USDC를 예치합니다
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balanceManagerId
 *               - amount
 *               - coinType
 *             properties:
 *               balanceManagerId:
 *                 type: string
 *                 description: Balance Manager ID
 *               amount:
 *                 type: number
 *                 description: 예치할 금액
 *               coinType:
 *                 type: string
 *                 description: 코인 타입 (USDC, SUI 등)
 *                 enum: [USDC, SUI, DBUSDC]
 *     responses:
 *       200:
 *         description: 예치 성공
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
 *                     balanceManagerId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     coinType:
 *                       type: string
 *                     transactionDigest:
 *                       type: string
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { balanceManagerId, amount, coinType } = body;

    if (!balanceManagerId || !amount || !coinType) {
      return NextResponse.json(
        { success: false, error: 'balanceManagerId, amount, and coinType are required' },
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

    // Initialize DeepBook client
    const env = process.env.NEXT_PUBLIC_ENV as "testnet" | "mainnet" || "testnet";
    const deepbookMM = new DeepBookMarketMaker(
      process.env.PLATFORM_PRIVATE_KEY,
      env
    );

    // Deposit to Balance Manager
    await deepbookMM.depositToManager(balanceManagerId, coinType, amount);

    // TODO: Record deposit in database

    return NextResponse.json({
      success: true,
      data: {
        balanceManagerId,
        amount,
        coinType,
        message: `Successfully deposited ${amount} ${coinType} to Balance Manager`,
      }
    });

  } catch (error: any) {
    console.error('Error depositing to balance manager:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to deposit to balance manager' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/dca/deposit/delegate:
 *   post:
 *     tags: [DCA]
 *     summary: TradeCap 위임
 *     description: 플랫폼에 거래 권한(TradeCap)을 위임합니다
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balanceManagerId
 *             properties:
 *               balanceManagerId:
 *                 type: string
 *                 description: Balance Manager ID
 *     responses:
 *       200:
 *         description: TradeCap 위임 성공
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
 *                     balanceManagerId:
 *                       type: string
 *                     tradeCapId:
 *                       type: string
 *                     platformAddress:
 *                       type: string
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { balanceManagerId } = body;

    if (!balanceManagerId) {
      return NextResponse.json(
        { success: false, error: 'balanceManagerId is required' },
        { status: 400 }
      );
    }

    // Check if platform private key and address are configured
    if (!process.env.PLATFORM_PRIVATE_KEY || !process.env.PLATFORM_ADDRESS) {
      return NextResponse.json(
        { success: false, error: 'Platform configuration incomplete' },
        { status: 500 }
      );
    }

    // Initialize DeepBook client
    const env = process.env.NEXT_PUBLIC_ENV as "testnet" | "mainnet" || "testnet";
    const deepbookMM = new DeepBookMarketMaker(
      process.env.PLATFORM_PRIVATE_KEY,
      env
    );

    // Delegate TradeCap to platform
    const tradeCapId = await deepbookMM.delegateTradeCap(
      balanceManagerId,
      process.env.PLATFORM_ADDRESS
    );

    // TODO: Save TradeCap ID to database

    return NextResponse.json({
      success: true,
      data: {
        balanceManagerId,
        tradeCapId,
        platformAddress: process.env.PLATFORM_ADDRESS,
        message: 'TradeCap successfully delegated to platform',
      }
    });

  } catch (error: any) {
    console.error('Error delegating trade cap:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delegate trade cap' },
      { status: 500 }
    );
  }
}