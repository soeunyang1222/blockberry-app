import { NextRequest, NextResponse } from 'next/server';
import { savingsVaultService } from '@/lib/services/savings-vault.service';
import { z } from 'zod';

const CreateSavingsVaultSchema = z.object({
  user_id: z.number().positive('User ID must be positive'),
  vault_name: z.string().min(1, 'Vault name is required'),
  target_token: z.string().min(1, 'Target token is required'),
  amount_fiat: z.number().positive('Amount must be positive'),
  fiat_symbol: z.string().min(1, 'Fiat symbol is required'),
  active: z.boolean().optional(),
});

/**
 * @swagger
 * /api/savings-vault:
 *   get:
 *     tags: [SavingsVault]
 *     summary: 사용자 저금통 조회
 *     description: 특정 사용자의 저금통 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID (필수)
 *         example: 1
 *     responses:
 *       200:
 *         description: 저금통 조회 성공
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
 *                     $ref: '#/components/schemas/SavingsVault'
 *       400:
 *         description: 잘못된 요청 (user_id 필수)
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    // user_id는 필수 파라미터
    if (!user_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_id parameter is required',
        },
        { status: 400 }
      );
    }

    const userId = parseInt(user_id);
    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid user_id parameter',
        },
        { status: 400 }
      );
    }

    // 사용자의 모든 저금통 조회
    const savingsVaults = await savingsVaultService.findByUserId(userId);

    return NextResponse.json({
      success: true,
      data: savingsVaults,
    });
  } catch (error) {
    console.error('Error fetching savings vaults:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch savings vaults',
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/savings-vault:
 *   post:
 *     tags: [SavingsVault]
 *     summary: 저금통 생성
 *     description: 새로운 저금통을 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - vault_name
 *               - target_token
 *               - amount_fiat
 *               - fiat_symbol
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *               vault_name:
 *                 type: string
 *                 description: 저금통 이름
 *                 example: "My Bitcoin Savings"
 *               target_token:
 *                 type: string
 *                 description: 대상 토큰
 *                 example: "BTC"
 *               amount_fiat:
 *                 type: number
 *                 description: 법정화폐 금액
 *                 example: 1000.00
 *               fiat_symbol:
 *                 type: string
 *                 description: 법정화폐 심볼
 *                 example: "USDC"
 *               active:
 *                 type: boolean
 *                 description: 활성 상태
 *                 example: true
 *     responses:
 *       201:
 *         description: 저금통 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SavingsVault'
 *                 message:
 *                   type: string
 *                   example: "Savings vault created successfully"
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 데이터 검증
    const validatedData = CreateSavingsVaultSchema.parse(body);
    
    const savingsVault = await savingsVaultService.create(validatedData);
    
    return NextResponse.json(
      {
        success: true,
        data: savingsVault,
        message: 'Savings vault created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating savings vault:', error);
    
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
        error: 'Failed to create savings vault',
      },
      { status: 500 }
    );
  }
}
