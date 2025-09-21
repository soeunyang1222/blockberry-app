import { NextRequest, NextResponse } from 'next/server';
import { DeepBookMarketMaker } from '@/lib/deepbook/DeepBookMarketMaker';
import { getDataSource } from '@/lib/database/connection';
import { User } from '@/lib/database/entities/user.entity';

/**
 * @swagger
 * /api/dca/balance-manager:
 *   post:
 *     tags: [DCA]
 *     summary: Balance Manager 생성
 *     description: DeepBook V3 Balance Manager를 생성합니다
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - walletAddress
 *             properties:
 *               userId:
 *                 type: number
 *                 description: 사용자 ID
 *               walletAddress:
 *                 type: string
 *                 description: 사용자 지갑 주소
 *     responses:
 *       200:
 *         description: Balance Manager 생성 성공
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
 *                       description: 생성된 Balance Manager ID
 *                     userId:
 *                       type: number
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, walletAddress } = body;

    if (!userId || !walletAddress) {
      return NextResponse.json(
        { success: false, error: 'userId and walletAddress are required' },
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

    // Get user from database
    const AppDataSource = await getDataSource();
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize DeepBook client
    const env = process.env.NEXT_PUBLIC_ENV as "testnet" | "mainnet" || "testnet";
    const deepbookMM = new DeepBookMarketMaker(
      process.env.PLATFORM_PRIVATE_KEY,
      env
    );

    // Create Balance Manager
    const balanceManagerId = await deepbookMM.createBalanceManager();

    // TODO: Save balance manager ID to database
    // Will need to create BalanceManager entity first

    return NextResponse.json({
      success: true,
      data: {
        balanceManagerId,
        userId,
        walletAddress,
      }
    });

  } catch (error: any) {
    console.error('Error creating balance manager:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create balance manager' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/dca/balance-manager:
 *   get:
 *     tags: [DCA]
 *     summary: Balance Manager 조회
 *     description: 사용자의 Balance Manager를 조회합니다
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: Balance Manager 조회 성공
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
 *                     tradeCap:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *       404:
 *         description: Balance Manager를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // TODO: Get balance manager from database
    // For now, return mock data
    const mockBalanceManager = {
      balanceManagerId: process.env.TESTNET_BALANCE_MANAGER_ADDRESS || null,
      tradeCap: null,
      createdAt: new Date().toISOString(),
    };

    if (!mockBalanceManager.balanceManagerId) {
      return NextResponse.json(
        { success: false, error: 'Balance Manager not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mockBalanceManager
    });

  } catch (error: any) {
    console.error('Error fetching balance manager:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch balance manager' },
      { status: 500 }
    );
  }
}