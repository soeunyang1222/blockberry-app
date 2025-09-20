# Task: Mock Data API Implementation for DCA and Investment Pages

## 목표
Next.js API Routes에 목업 데이터 API를 구현하여 `/dca`와 `/investment` 페이지의 기능들이 정상적으로 동작하도록 만들기

## 현황 분석

### DCA 페이지 (`/dca`)
- **컴포넌트**: DCABuyForm
- **필요한 데이터**:
  - 지갑 잔액 (USDC)
  - DCA 주문 생성/실행 기능
  - 주문 상태 관리

### Investment 페이지 (`/investment`)
- **컴포넌트**: PortfolioOverview, RecurringOrders
- **필요한 데이터**:
  - 포트폴리오 개요 (총 자산, 수익률 등)
  - 거래 내역
  - 반복 주문 목록

## 구현 계획

### 1. API 엔드포인트 설계

#### Portfolio API (`/api/portfolio`)
```typescript
GET /api/portfolio
Response: {
  totalValue: number      // 총 자산 가치
  totalInvested: number   // 총 투자 금액
  totalReturn: number     // 총 수익
  returnRate: number      // 수익률 (%)
  holdings: [{
    asset: string
    amount: number
    value: number
    change24h: number
  }]
}
```

#### Transactions API (`/api/transactions`)
```typescript
GET /api/transactions
Query: { limit?: number, offset?: number }
Response: {
  transactions: [{
    id: string
    date: string
    type: 'buy' | 'sell'
    asset: string
    amount: number
    price: number
    value: number
    status: 'completed' | 'pending' | 'failed'
  }]
  total: number
}
```

#### DCA Orders API (`/api/dca/orders`)
```typescript
GET /api/dca/orders
Response: {
  orders: [{
    id: string
    createdAt: string
    frequency: 'daily' | 'weekly' | 'monthly'
    amount: number
    fromAsset: string
    toAsset: string
    status: 'active' | 'paused' | 'completed'
    nextExecution: string
    executedCount: number
    totalInvested: number
  }]
}

POST /api/dca/orders
Body: {
  frequency: string
  amount: number
  fromAsset: string
  toAsset: string
}
Response: { success: boolean, order: Order }
```

#### Wallet Balance API (`/api/wallet/balance`)
```typescript
GET /api/wallet/balance
Response: {
  balances: [{
    asset: string
    symbol: string
    amount: number
    value: number
  }]
  totalValue: number
}
```

### 2. 목업 데이터 구조

```typescript
// Mock Database
const mockData = {
  wallet: {
    usdc: 10000,
    wbtc: 0.05
  },
  
  portfolio: {
    totalInvested: 5000,
    currentValue: 5500
  },
  
  transactions: [
    // 최근 거래 내역 (10-20개)
  ],
  
  dcaOrders: [
    // 활성 DCA 주문 (2-3개)
  ]
}
```

### 3. 구현 순서

1. **브랜치 생성**
   ```bash
   git checkout -b feature/mock-api
   ```

2. **API Routes 구현**
   - [ ] `/api/portfolio/route.ts`
   - [ ] `/api/transactions/route.ts`
   - [ ] `/api/dca/orders/route.ts`
   - [ ] `/api/wallet/balance/route.ts`

3. **Mock 데이터 생성 유틸리티**
   - [ ] `/lib/mock/data.ts` - 목업 데이터 저장소
   - [ ] `/lib/mock/generators.ts` - 랜덤 데이터 생성 함수

4. **컴포넌트 연결**
   - [ ] DCABuyForm - 지갑 잔액 API 연결
   - [ ] PortfolioOverview - 포트폴리오 API 연결
   - [ ] RecurringOrders - 거래 내역 및 주문 API 연결

5. **테스트 및 검증**
   - [ ] API 엔드포인트 동작 확인
   - [ ] 페이지 렌더링 확인
   - [ ] 데이터 흐름 검증

## 성공 기준

- [ ] `/dca` 페이지에서 지갑 잔액이 표시됨
- [ ] DCA 주문을 생성할 수 있음 (목업)
- [ ] `/investment` 페이지에서 포트폴리오 개요가 표시됨
- [ ] 거래 내역이 표시됨
- [ ] 반복 주문 목록이 표시됨
- [ ] 모든 API가 적절한 목업 데이터를 반환함
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 검사 통과

## 참고사항

- 실제 블록체인 연결은 하지 않음 (목업 데이터만 사용)
- 데이터는 메모리에만 저장 (서버 재시작시 초기화)
- 추후 실제 API로 교체 가능하도록 인터페이스 설계
- Next.js App Router 규칙 준수 (`route.ts` 파일 사용)