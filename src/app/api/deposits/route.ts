import { NextRequest, NextResponse } from 'next/server';
import { depositService } from '@/lib/services/deposit.service';
import { z } from 'zod';

const CreateDepositSchema = z.object({
  vault_id: z.number().positive('Vault ID must be positive'),
  user_id: z.number().positive('User ID must be positive'),
  amount_fiat: z.number().positive('Amount must be positive'),
  fiat_symbol: z.string().min(1, 'Fiat symbol is required'),
  tx_hash: z.string().min(1, 'Transaction hash is required'),
});

/**
 * @swagger
 * /api/deposits:
 *   get:
 *     tags: [Deposits]
 *     summary: 모든 입금 내역 조회
 *     description: 등록된 모든 입금 내역을 조회합니다.
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
 *         description: 입금 내역 조회 성공
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
 *                     $ref: '#/components/schemas/Deposit'
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const vault_id = searchParams.get('vault_id');

    let deposits;
    if (user_id) {
      deposits = await depositService.findByUserId(parseInt(user_id));
    } else if (vault_id) {
      deposits = await depositService.findByVaultId(parseInt(vault_id));
    } else {
      deposits = await depositService.findAll();
    }

    return NextResponse.json({
      success: true,
      data: deposits,
    });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch deposits',
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/deposits:
 *   post:
 *     tags: [Deposits]
 *     summary: 입금 생성
 *     description: 새로운 입금을 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vault_id
 *               - user_id
 *               - amount_fiat
 *               - fiat_symbol
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
 *               amount_fiat:
 *                 type: integer
 *                 description: 입금 금액 (센트 단위)
 *                 example: 100000
 *               fiat_symbol:
 *                 type: string
 *                 description: 법정화폐 심볼
 *                 example: "KRW"
 *               tx_hash:
 *                 type: string
 *                 description: 트랜잭션 해시
 *                 example: "0xabcdef..."
 *     responses:
 *       201:
 *         description: 입금 생성 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 데이터 검증
    const validatedData = CreateDepositSchema.parse(body);
    
    const deposit = await depositService.create(validatedData);
    
    return NextResponse.json(
      {
        success: true,
        data: deposit,
        message: 'Deposit created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating deposit:', error);
    
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
        error: 'Failed to create deposit',
      },
      { status: 500 }
    );
  }
}
