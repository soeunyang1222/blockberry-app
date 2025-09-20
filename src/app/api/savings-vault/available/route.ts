import { NextRequest, NextResponse } from 'next/server';
import { savingsVaultService } from '@/lib/services/savings-vault.service';

/**
 * @swagger
 * /api/savings-vault/available:
 *   get:
 *     tags: [SavingsVault]
 *     summary: 조회 가능한 저금통 조회
 *     description: 활성화된(active=true) 저금통들을 조회합니다. 사용자별 필터링이 가능합니다.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 사용자 ID로 필터링
 *     responses:
 *       200:
 *         description: 조회 가능한 저금통 조회 성공
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
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    let savingsVaults;
    
    if (user_id) {
      const userId = parseInt(user_id);
      if (isNaN(userId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid user_id',
          },
          { status: 400 }
        );
      }
      savingsVaults = await savingsVaultService.findAvailableVaultsByUser(userId);
    } else {
      savingsVaults = await savingsVaultService.findAllAvailableVaults();
    }

    return NextResponse.json({
      success: true,
      data: savingsVaults,
      count: savingsVaults.length,
    });
  } catch (error) {
    console.error('Error fetching available savings vaults:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch available savings vaults',
      },
      { status: 500 }
    );
  }
}
