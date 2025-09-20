# 🔌 API 참조 문서 - Blockberry App

## 개요

Blockberry DCA 플랫폼의 완전한 API 참조 문서입니다. 모든 엔드포인트는 요청/응답 본문에 JSON을 사용하며 REST 규칙을 따릅니다.

**기본 URL**: `http://localhost:3000`  
**API 문서**: `http://localhost:3000/api` (Swagger UI)

---

## 🔐 인증

현재 지갑 기반 식별을 사용합니다. 이 PoC에서는 JWT 토큰이 필요하지 않습니다.

**인증 방법**: 지갑 주소 검증
- 사용자는 Sui 지갑 주소로 식별됩니다
- 모든 작업에는 등록된 지갑의 유효한 `user_id`가 필요합니다

---

## 📋 전역 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": { /* 응답 데이터 */ },
  "message": "작업이 성공적으로 완료되었습니다"
}
```

### 오류 응답
```json
{
  "success": false,
  "error": "상세한 오류 설명",
  "statusCode": 400,
  "timestamp": "2024-09-20T10:30:00.000Z",
  "path": "/api/endpoint"
}
```

---

## 👥 사용자 API

### 사용자 생성
```http
POST /users
```

**요청 본문**:
```json
{
  "wallet_address": "0x1234567890abcdef..."
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "wallet_address": "0x1234567890abcdef...",
    "created_at": "2024-09-20T10:30:00.000Z"
  }
}
```

### 모든 사용자 조회
```http
GET /users
```

**응답**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "wallet_address": "0x1234567890abcdef...",
      "created_at": "2024-09-20T10:30:00.000Z"
    }
  ]
}
```

### ID로 사용자 조회
```http
GET /users/:id
```

**매개변수**:
- `id` (number): 사용자 ID

**응답**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "wallet_address": "0x1234567890abcdef...",
    "created_at": "2024-09-20T10:30:00.000Z"
  }
}
```

### 지갑 주소로 사용자 조회
```http
GET /users/wallet/:wallet_address
```

**매개변수**:
- `wallet_address` (string): Sui 지갑 주소

### 사용자 삭제
```http
DELETE /users/:id
```

**매개변수**:
- `id` (number): 삭제할 사용자 ID

---

## 💰 저금고 API

### 저금고 생성
```http
POST /savings-vault
```

**요청 본문**:
```json
{
  "user_id": 1,
  "vault_name": "내 비트코인 저금고",
  "target_token": "BTC",
  "interval_days": 7,
  "amount_fiat": 100000,
  "fiat_symbol": "KRW",
  "duration_days": 365
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "vault_id": 1,
    "user_id": 1,
    "vault_name": "내 비트코인 저금고",
    "target_token": "BTC",
    "interval_days": 7,
    "amount_fiat": 100000,
    "fiat_symbol": "KRW",
    "duration_days": 365,
    "total_deposit": 0,
    "active": true,
    "created_at": "2024-09-20T10:30:00.000Z"
  }
}
```

### 모든 저금고 조회
```http
GET /savings-vault
```

### ID로 저금고 조회
```http
GET /savings-vault/:vault_id
```

### 사용자의 저금고 조회
```http
GET /savings-vault/user/:user_id
```

### 저금고 활성 상태 변경
```http
PATCH /savings-vault/:vault_id/active
```

**요청 본문**:
```json
{
  "active": false
}
```

### 저금고 삭제
```http
DELETE /savings-vault/:vault_id
```

---

## 💳 입금 API

### 입금 생성
```http
POST /deposits
```

**요청 본문**:
```json
{
  "vault_id": 1,
  "user_id": 1,
  "amount_fiat": 100000,
  "fiat_symbol": "KRW",
  "tx_hash": "0xabcdef1234567890..."
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "deposit_id": 1,
    "vault_id": 1,
    "user_id": 1,
    "amount_fiat": 100000,
    "fiat_symbol": "KRW",
    "tx_hash": "0xabcdef1234567890...",
    "created_at": "2024-09-20T10:30:00.000Z"
  }
}
```

### 모든 입금 조회
```http
GET /deposits
```

### ID로 입금 조회
```http
GET /deposits/:deposit_id
```

### 사용자의 입금 조회
```http
GET /deposits/user/:user_id
```

### 저금고의 입금 조회
```http
GET /deposits/vault/:vault_id
```

### 잔액 조회
```http
GET /deposits/balance?user_id=1&vault_id=1
```

**쿼리 매개변수**:
- `user_id` (number): 사용자 ID
- `vault_id` (number, 선택사항): 특정 저금고 ID

**응답**:
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "vault_id": 1,
    "total_deposits": 500000,
    "fiat_symbol": "KRW",
    "deposit_count": 5
  }
}
```

### 입금 삭제
```http
DELETE /deposits/:deposit_id
```

---

## 📈 거래 API

### 거래 생성
```http
POST /trades
```

**요청 본문**:
```json
{
  "vault_id": 1,
  "user_id": 1,
  "fiat_amount": 100000,
  "fiat_symbol": "KRW",
  "token_symbol": "BTC",
  "token_amount": 150000,
  "price_executed": 66666666,
  "tx_hash": "0xfedcba0987654321..."
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "trade_id": 1,
    "vault_id": 1,
    "user_id": 1,
    "fiat_amount": 100000,
    "fiat_symbol": "KRW",
    "token_symbol": "BTC",
    "token_amount": 150000,
    "price_executed": 66666666,
    "tx_hash": "0xfedcba0987654321...",
    "created_at": "2024-09-20T10:30:00.000Z"
  }
}
```

### 모든 거래 조회
```http
GET /trades
```

### ID로 거래 조회
```http
GET /trades/:trade_id
```

### 사용자의 거래 조회
```http
GET /trades/user/:user_id
```

### 저금고의 거래 조회
```http
GET /trades/vault/:vault_id
```

### 거래 삭제
```http
DELETE /trades/:trade_id
```

---

## 🎯 메인 API (DCA 작업)

### 저금고 생성 (고수준)
```http
POST /api/create-savings
```

**요청 본문**:
```json
{
  "user_id": 1,
  "vault_name": "내 비트코인 DCA",
  "target_token": "BTC",
  "interval_days": 7,
  "amount_fiat": 100000,
  "fiat_symbol": "KRW",
  "duration_days": 365
}
```

**기능**:
- 저금고 생성
- 필요시 사용자 초기화
- 완전한 저금고 구성 반환

### 입금 처리
```http
POST /api/deposit
```

**요청 본문**:
```json
{
  "vault_id": 1,
  "user_id": 1,
  "amount_fiat": 100000,
  "fiat_symbol": "KRW",
  "tx_hash": "0xabcdef1234567890..."
}
```

**기능**:
- 입금 거래 기록
- 저금고 총 입금액 업데이트
- 사용자와 저금고 연결 검증

### 매수 실행
```http
POST /api/execute-buy
```

**요청 본문**:
```json
{
  "vault_id": 1,
  "user_id": 1,
  "amount_fiat": 100000
}
```

**기능**:
- DCA 구매 실행
- 거래 기록
- 최적 가격을 위한 Cetus와 통합
- 사용자 포트폴리오 업데이트

### 거래 내역 조회
```http
GET /api/transactions?user_id=1&vault_id=1&limit=50
```

**쿼리 매개변수**:
- `user_id` (number): 사용자 ID
- `vault_id` (number, 선택사항): 특정 저금고
- `limit` (number, 선택사항): 결과 제한 (기본값: 50)

**응답**:
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "vault_id": 1,
    "deposits": [
      {
        "deposit_id": 1,
        "amount_fiat": 100000,
        "fiat_symbol": "KRW",
        "tx_hash": "0xabc...",
        "created_at": "2024-09-20T10:30:00.000Z"
      }
    ],
    "trades": [
      {
        "trade_id": 1,
        "fiat_amount": 100000,
        "token_symbol": "BTC",
        "token_amount": 150000,
        "price_executed": 66666666,
        "tx_hash": "0xdef...",
        "created_at": "2024-09-20T10:35:00.000Z"
      }
    ],
    "summary": {
      "total_deposits": 500000,
      "total_trades": 5,
      "total_tokens": 750000,
      "average_price": 66666666
    }
  }
}
```

### 지갑 검증
```http
GET /api/verify-wallet/:wallet_address
```

**매개변수**:
- `wallet_address` (string): 검증할 Sui 지갑 주소

**응답**:
```json
{
  "success": true,
  "data": {
    "wallet_address": "0x1234567890abcdef...",
    "is_valid": true,
    "is_registered": true,
    "user_id": 1,
    "balance": "1000000000", // 최소 단위
    "last_transaction": "2024-09-20T10:30:00.000Z"
  }
}
```

---

## 📊 분석 API

### 성능 분석
```http
GET /analytics/performance?user_id=1&vault_id=1&period=30d
```

**쿼리 매개변수**:
- `user_id` (number): 사용자 ID
- `vault_id` (number, 선택사항): 특정 저금고
- `period` (string): 기간 (7d, 30d, 90d, 1y)

**응답**:
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "dca_performance": {
      "total_invested": 3000000,
      "total_tokens": 4500000,
      "average_price": 66666666,
      "current_value": 3150000,
      "profit_loss": 150000,
      "profit_loss_percentage": 5.0
    },
    "cex_comparison": {
      "cex_average_price": 67000000,
      "dca_vs_cex_savings": 150000,
      "alpha_percentage": 0.5
    },
    "best_execution": {
      "best_price": 65000000,
      "worst_price": 68000000,
      "price_spread": 3000000
    }
  }
}
```

### 시장 비교
```http
GET /analytics/market-comparison?token=BTC&period=7d
```

---

## 🌊 블록체인 통합 API

### Sui 네트워크 상태
```http
GET /sui/network-status
```

### Cetus 풀 정보
```http
GET /cetus/pools?token_a=USDC&token_b=BTC
```

### 현재 가격
```http
GET /price/current?symbols=BTC,ETH,SUI
```

### 주문서 깊이
```http
GET /orderbook/depth?pair=USDC-BTC&depth=10
```

---

## 🔧 데이터 타입

### 사용자
```typescript
interface User {
  id: number;
  wallet_address: string;
  created_at: Date;
}
```

### 저금고
```typescript
interface SavingsVault {
  vault_id: number;
  user_id: number;
  vault_name: string;
  target_token: string;
  interval_days: number;
  amount_fiat: number; // 센트 단위
  fiat_symbol: string;
  duration_days: number;
  total_deposit: number; // 센트 단위
  active: boolean;
  created_at: Date;
}
```

### 입금
```typescript
interface Deposit {
  deposit_id: number;
  vault_id: number;
  user_id: number;
  amount_fiat: number; // 센트 단위
  fiat_symbol: string;
  tx_hash: string;
  created_at: Date;
}
```

### 거래
```typescript
interface Trade {
  trade_id: number;
  vault_id: number;
  user_id: number;
  fiat_amount: number; // 센트 단위
  fiat_symbol: string;
  token_symbol: string;
  token_amount: number; // 최소 토큰 단위
  price_executed: number; // 센트 단위
  tx_hash: string;
  created_at: Date;
}
```

---

## ⚠️ 오류 코드

| 코드 | 설명 | 예시 |
|------|------|------|
| 400 | 잘못된 요청 | 유효하지 않은 요청 매개변수 |
| 401 | 권한 없음 | 유효하지 않은 지갑 주소 |
| 404 | 찾을 수 없음 | 사용자/저금고/입금을 찾을 수 없음 |
| 409 | 충돌 | 지갑 주소가 이미 존재함 |
| 422 | 처리할 수 없는 엔티티 | 검증 오류 |
| 500 | 내부 서버 오류 | 데이터베이스 연결 오류 |

---

## 🚀 예시

### 완전한 DCA 플로우

```bash
# 1. 사용자 생성
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0x1234567890abcdef"}'

# 2. 저금고 생성
curl -X POST http://localhost:3000/api/create-savings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "vault_name": "주간 BTC DCA",
    "target_token": "BTC",
    "interval_days": 7,
    "amount_fiat": 100000,
    "fiat_symbol": "KRW",
    "duration_days": 365
  }'

# 3. 입금하기
curl -X POST http://localhost:3000/api/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "vault_id": 1,
    "user_id": 1,
    "amount_fiat": 500000,
    "fiat_symbol": "KRW",
    "tx_hash": "0xabc123def456"
  }'

# 4. DCA 매수 실행
curl -X POST http://localhost:3000/api/execute-buy \
  -H "Content-Type: application/json" \
  -d '{
    "vault_id": 1,
    "user_id": 1,
    "amount_fiat": 100000
  }'

# 5. 거래 내역 확인
curl "http://localhost:3000/api/transactions?user_id=1&vault_id=1"
```

---

## 🔗 관련 문서

- **설정 가이드**: [SETUP.md](../SETUP.md)
- **메인 문서**: [DOCUMENTATION.md](../DOCUMENTATION.md)
- **프로젝트 README**: [README.md](../README.md)
- **Swagger UI**: http://localhost:3000/api

---

*마지막 업데이트: 2024-09-20*