import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user.service';

interface RouteParams {
  params: {
    wallet_address: string;
  };
}

/**
 * @swagger
 * /api/users/wallet/{wallet_address}:
 *   get:
 *     tags: [Users]
 *     summary: 지갑 주소로 사용자 조회
 *     description: 지갑 주소로 사용자 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: wallet_address
 *         required: true
 *         schema:
 *           type: string
 *         description: 지갑 주소
 *         example: "0x1234567890abcdef1234567890abcdef12345678"
 *     responses:
 *       200:
 *         description: 사용자 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { wallet_address } = params;
    
    const user = await userService.findByWalletAddress(wallet_address);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user by wallet address:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}
