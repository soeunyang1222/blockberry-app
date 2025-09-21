import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateSavingsVaultSchema = z.object({
  user_id: z.number().positive('User ID must be positive'),
  vault_name: z.string().min(1, 'Vault name is required'),
  target_token: z.string().min(1, 'Target token is required'),
  amount_fiat: z.number().positive('Amount must be positive'),
  fiat_symbol: z.string().min(1, 'Fiat symbol is required'),
  active: z.boolean().optional(),
});

// Mock data
let mockVaults = [
  {
    id: 1,
    user_id: 1,
    vault_name: 'BTC Savings',
    target_token: 'WBTC',
    amount_fiat: 100,
    fiat_symbol: 'USDC',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

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
    const userIdParam = searchParams.get('user_id');

    if (!userIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_id is required',
        },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdParam, 10);
    const userVaults = mockVaults.filter(v => v.user_id === userId);

    return NextResponse.json({
      success: true,
      data: userVaults,
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
 *                 example: "BTC 저금통"
 *               target_token:
 *                 type: string
 *                 description: 목표 토큰 (저축할 암호화폐)
 *                 example: "BTC"
 *               amount_fiat:
 *                 type: number
 *                 description: 저금 금액 (법정화폐 기준)
 *                 example: 100
 *               fiat_symbol:
 *                 type: string
 *                 description: 법정화폐 심볼
 *                 example: "USD"
 *               active:
 *                 type: boolean
 *                 description: 활성화 상태 (선택사항, 기본값 true)
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
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateSavingsVaultSchema.parse(body);

    const newVault = {
      id: mockVaults.length + 1,
      ...validatedData,
      active: validatedData.active !== undefined ? validatedData.active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockVaults.push(newVault);

    return NextResponse.json({
      success: true,
      data: newVault,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    console.error('Error creating savings vault:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create savings vault',
      },
      { status: 500 }
    );
  }
}