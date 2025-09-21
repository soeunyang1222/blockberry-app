// 숫자 포맷팅 유틸리티 함수

/**
 * 숫자를 천 단위 구분자(,)를 포함한 문자열로 변환
 * @param amount - 포맷팅할 숫자
 * @param decimals - 소수점 자릿수 (기본값: 2)
 * @returns 포맷팅된 문자열
 */
export function formatNumber(amount: number, decimals: number = 2): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * USDC 금액 포맷팅
 * @param amount - USDC 금액
 * @returns 포맷팅된 USDC 문자열
 */
export function formatUSDC(amount: number): string {
  return `${formatNumber(amount, 2)} USDC`
}

/**
 * USD 금액 포맷팅 (달러 기호 포함)
 * @param amount - USD 금액
 * @returns 포맷팅된 USD 문자열
 */
export function formatUSD(amount: number): string {
  return `$${formatNumber(amount, 2)}`
}

/**
 * BTC 금액 포맷팅
 * @param amount - BTC 금액
 * @returns 포맷팅된 BTC 문자열
 */
export function formatBTC(amount: number): string {
  return `${formatNumber(amount, 6)} BTC`
}

/**
 * 퍼센트 포맷팅
 * @param percentage - 퍼센트 값
 * @returns 포맷팅된 퍼센트 문자열
 */
export function formatPercentage(percentage: number): string {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(2)}%`
}