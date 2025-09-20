import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/btc-price:
 *   get:
 *     tags: [Price]
 *     summary: BTC 현재 가격 조회
 *     description: Bitcoin의 현재 가격을 조회합니다.
 *     responses:
 *       200:
 *         description: BTC 가격 조회 성공
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
 *                     symbol:
 *                       type: string
 *                       example: "BTC"
 *                     price_usd:
 *                       type: number
 *                       description: USD 가격
 *                       example: 65000
 *                     price_krw:
 *                       type: number
 *                       description: KRW 가격
 *                       example: 86000000
 *                     change_24h:
 *                       type: number
 *                       description: 24시간 변동률
 *                       example: 2.5
 *                     last_updated:
 *                       type: string
 *                       format: date-time
 *                       description: 마지막 업데이트 시간
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    // TODO: 실제 가격 API (CoinGecko 등) 연동
    // 현재는 시뮬레이션 데이터를 반환
    const mockPriceData = {
      symbol: 'BTC',
      price_usd: 65000 + (Math.random() - 0.5) * 5000, // 랜덤 변동
      price_krw: 86000000 + (Math.random() - 0.5) * 10000000,
      change_24h: (Math.random() - 0.5) * 10, // -5% ~ +5% 변동
      volume_24h: 25000000000,
      market_cap: 1300000000000,
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockPriceData,
    });
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch BTC price',
      },
      { status: 500 }
    );
  }
}
