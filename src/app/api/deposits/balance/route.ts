import { NextRequest, NextResponse } from 'next/server';
import { depositService } from '@/lib/services/deposit.service';

/**
 * @swagger
 * /api/deposits/balance:
 *   get:
 *     tags: [Deposits]
 *     summary: 잔액 조회
 *     description: 사용자의 입금 잔액을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *       - in: query
 *         name: vault_id
 *         schema:
 *           type: integer
 *         description: 저금고 ID (선택사항)
 *     responses:
 *       200:
 *         description: 잔액 조회 성공
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
 *                     total_balance:
 *                       type: integer
 *                       description: 총 잔액
 *                       example: 500000
 *                     deposits:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Deposit'
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

    if (!user_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
        },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(user_id);
    const vaultIdNum = vault_id ? parseInt(vault_id) : undefined;

    if (isNaN(userIdNum) || (vault_id && isNaN(vaultIdNum!))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid user ID or vault ID',
        },
        { status: 400 }
      );
    }

    const balance = await depositService.getBalance(userIdNum, vaultIdNum);

    return NextResponse.json({
      success: true,
      data: balance,
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch balance',
      },
      { status: 500 }
    );
  }
}
