import { NextRequest, NextResponse } from 'next/server';
import { tradeService } from '@/lib/services/trade.service';
import { userService } from '@/lib/services/user.service';
import { z } from 'zod';

const ExecuteBuySchema = z.object({
  vault_id: z.number().positive('Vault ID must be positive'),
  user_id: z.number().positive('User ID must be positive'),
  fiat_amount: z.number().positive('Fiat amount must be positive'),
  fiat_symbol: z.string().min(1, 'Fiat symbol is required'),
  token_symbol: z.string().min(1, 'Token symbol is required'),
});

/**
 * @swagger
 * /api/execute-buy:
 *   post:
 *     tags: [DCA]
 *     summary: DCA 매수 실행
 *     description: DCA(Dollar Cost Averaging) 매수를 실행합니다.
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
 *                 type: integer
 *                 description: 매수할 법정화폐 금액
 *                 example: 100000
 *               fiat_symbol:
 *                 type: string
 *                 description: 법정화폐 심볼
 *                 example: "KRW"
 *               token_symbol:
 *                 type: string
 *                 description: 매수할 토큰 심볼
 *                 example: "BTC"
 *     responses:
 *       201:
 *         description: 매수 실행 성공
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
 *                     trade:
 *                       $ref: '#/components/schemas/Trade'
 *                     swap_result:
 *                       type: object
 *                       description: 스왑 실행 결과
 *                     message:
 *                       type: string
 *                       description: 결과 메시지
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 데이터 검증
    const validatedData = ExecuteBuySchema.parse(body);
    
    // 사용자 정보 조회
    const user = await userService.findOne(validatedData.user_id);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // TODO: 실제 블록체인 스왑 로직 구현
    // 현재는 시뮬레이션 데이터를 반환
    const mockPrice = 100000000; // 1억원 (센트 단위)
    const mockTokenAmount = validatedData.fiat_amount / mockPrice;
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    const swapResult = {
      success: true,
      message: 'DCA swap executed successfully (simulation)',
      tx_hash: mockTxHash,
      amount_in: validatedData.fiat_amount,
      amount_out: mockTokenAmount,
      price: mockPrice,
      slippage: 0.5,
    };

    // 거래 기록 저장
    const trade = await tradeService.create({
      vault_id: validatedData.vault_id,
      user_id: validatedData.user_id,
      fiat_amount: validatedData.fiat_amount,
      fiat_symbol: validatedData.fiat_symbol,
      token_symbol: validatedData.token_symbol,
      token_amount: mockTokenAmount,
      price_executed: mockPrice,
      tx_hash: mockTxHash,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          trade,
          swap_result: swapResult,
          message: swapResult.message,
        },
        message: 'DCA buy executed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error executing DCA buy:', error);
    
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
        error: 'Failed to execute DCA buy',
      },
      { status: 500 }
    );
  }
}
