import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/verify-wallet:
 *   get:
 *     tags: [Wallet]
 *     summary: 지갑 주소 검증
 *     description: Sui 지갑 주소를 검증합니다.
 *     parameters:
 *       - in: query
 *         name: wallet_address
 *         required: true
 *         schema:
 *           type: string
 *         description: 검증할 지갑 주소
 *         example: "0x1234567890abcdef1234567890abcdef12345678"
 *     responses:
 *       200:
 *         description: 지갑 검증 결과
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
 *                     valid:
 *                       type: boolean
 *                       description: 지갑 주소 유효성
 *                       example: true
 *                     wallet_address:
 *                       type: string
 *                       description: 검증된 지갑 주소
 *                       example: "0x1234567890abcdef1234567890abcdef12345678"
 *                     account_info:
 *                       type: object
 *                       description: 계정 정보 (사용 가능한 경우)
 *                     error:
 *                       type: string
 *                       description: 오류 메시지 (검증 실패 시)
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet_address = searchParams.get('wallet_address');

    if (!wallet_address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address is required',
        },
        { status: 400 }
      );
    }

    // 기본적인 Sui 주소 형식 검증
    const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/;
    const isValidFormat = suiAddressRegex.test(wallet_address);

    if (!isValidFormat) {
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          wallet_address,
          error: 'Invalid Sui address format',
        },
      });
    }

    // TODO: 실제 Sui SDK를 사용한 지갑 검증 구현
    // 현재는 시뮬레이션 데이터를 반환
    try {
      // const accountInfo = await suiService.getAccountByHash(wallet_address);
      const mockAccountInfo = {
        address: wallet_address,
        balance: '0',
        sequence_number: '0',
        // 추가 계정 정보...
      };

      return NextResponse.json({
        success: true,
        data: {
          valid: true,
          wallet_address,
          account_info: mockAccountInfo,
        },
      });
    } catch (error) {
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          wallet_address,
          error: `Sui SDK validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      });
    }
  } catch (error) {
    console.error('Error verifying wallet:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify wallet',
      },
      { status: 500 }
    );
  }
}
