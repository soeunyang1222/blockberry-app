import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/dca-simulation:
 *   get:
 *     tags: [Simulation]
 *     summary: DCA 시뮬레이션 데이터 조회
 *     description: DCA(Dollar Cost Averaging) 시뮬레이션 데이터를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 시뮬레이션 기간 (일)
 *         example: 30
 *     responses:
 *       200:
 *         description: DCA 시뮬레이션 데이터 조회 성공
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
 *                     period_days:
 *                       type: integer
 *                       description: 시뮬레이션 기간
 *                       example: 30
 *                     total_invested:
 *                       type: number
 *                       description: 총 투자 금액
 *                       example: 3000000
 *                     total_btc_acquired:
 *                       type: number
 *                       description: 총 획득한 BTC
 *                       example: 0.046
 *                     average_price:
 *                       type: number
 *                       description: 평균 매수 가격
 *                       example: 65217391
 *                     current_value:
 *                       type: number
 *                       description: 현재 평가 금액
 *                       example: 3150000
 *                     profit_loss:
 *                       type: number
 *                       description: 손익
 *                       example: 150000
 *                     profit_loss_percentage:
 *                       type: number
 *                       description: 손익률 (%)
 *                       example: 5.0
 *                     price_history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           price:
 *                             type: number
 *                           investment:
 *                             type: number
 *                           btc_acquired:
 *                             type: number
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // DCA 시뮬레이션 데이터 생성
    const dailyInvestment = 100000; // 일일 10만원 투자
    const priceHistory = [];
    const currentDate = new Date();
    
    let totalInvested = 0;
    let totalBtcAcquired = 0;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      // 랜덤 BTC 가격 생성 (현실적인 변동성 고려)
      const basePrice = 65000000; // 6500만원
      const volatility = 0.05; // 5% 일일 변동성
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const price = Math.floor(basePrice * (1 + randomChange));
      
      const btcAcquired = dailyInvestment / price;
      
      totalInvested += dailyInvestment;
      totalBtcAcquired += btcAcquired;
      
      priceHistory.push({
        date: date.toISOString().split('T')[0],
        price,
        investment: dailyInvestment,
        btc_acquired: btcAcquired,
        cumulative_investment: totalInvested,
        cumulative_btc: totalBtcAcquired,
      });
    }
    
    const currentBtcPrice = 65000000; // 현재 BTC 가격
    const currentValue = totalBtcAcquired * currentBtcPrice;
    const profitLoss = currentValue - totalInvested;
    const profitLossPercentage = (profitLoss / totalInvested) * 100;
    const averagePrice = totalInvested / totalBtcAcquired;

    return NextResponse.json({
      success: true,
      data: {
        period_days: days,
        total_invested: totalInvested,
        total_btc_acquired: totalBtcAcquired,
        average_price: averagePrice,
        current_btc_price: currentBtcPrice,
        current_value: currentValue,
        profit_loss: profitLoss,
        profit_loss_percentage: profitLossPercentage,
        price_history: priceHistory,
        simulation_note: 'This is a simulation based on historical volatility patterns',
      },
    });
  } catch (error) {
    console.error('Error generating DCA simulation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate DCA simulation',
      },
      { status: 500 }
    );
  }
}
