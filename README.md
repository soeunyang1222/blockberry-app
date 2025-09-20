# 🫐 Blockberry - Sui DCA Platform

**Next.js 풀스택 애플리케이션**으로 구축된 Sui 블록체인 기반 달러 코스트 애버리징(DCA) 플랫폼입니다. Cetus Aggregator를 활용하여 Sui DEX들 사이에서 USDC → Wrapped BTC로 가장 저렴한 스왑을 찾아 실행합니다.

## 🎯 프로젝트 개요

이 플랫폼은 해커톤용으로 개발된 DCA 플랫폼으로, 다음과 같은 기능을 제공합니다:

- **지갑 연결 및 사용자 관리**
- **BTC 적립 설정 생성** (매수당 USDC 금액, 빈도, 시간)
- **USDC를 스마트 컨트랙트에 예치**
- **자동/스케줄 매수** (현재는 수동 또는 시뮬레이션)
- **누적된 BTC 확인**
- **가상의 CEX 매수와 비교** (업비트/빗썸 고정 시각 매수)
- **사용자 거래내역 표시**
- **"알파" 표시** (가장 저렴한 경로로 얻은 추가 BTC)
- **DeepBook 거래 자동 동기화** (사용자 지갑 주소 기반)
- **실시간 트랜잭션 모니터링** (Sui 메인넷/테스트넷)

## 🏗️ 기술 스택

### 🚀 최신 업데이트 (2024-09-20)

프로젝트가 **NestJS**에서 **Next.js 풀스택 애플리케이션**으로 마이그레이션되었습니다!

```yaml
Frontend & Backend:
  - Next.js 14+ (App Router)
  - React 18 + TypeScript
  - Tailwind CSS

Database & ORM:
  - PostgreSQL (Neon Cloud) - 운영용 데이터베이스
  - SQLite (better-sqlite3) - 개발/테스트용 Mock 데이터베이스
  - TypeORM

Blockchain:
  - Sui Network (메인넷/테스트넷)
  - DeepBook DEX 연동
  - Cetus Protocol (예정)

Development:
  - TypeScript
  - ESLint + Prettier
  - pnpm
```

## 📁 새로운 프로젝트 구조

```
blockberry-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes (기존 NestJS 컨트롤러들)
│   │   │   ├── users/
│   │   │   ├── savings-vault/
│   │   │   ├── deposits/
│   │   │   ├── trades/
│   │   │   └── scheduler/     # 트랜잭션 동기화 스케줄러
│   │   ├── dashboard/         # DCA 대시보드 페이지들
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 홈페이지
│   ├── lib/                   # 라이브러리 & 유틸리티
│   │   ├── database/          # TypeORM 설정 & 엔티티
│   │   ├── services/          # 비즈니스 로직
│   │   │   ├── transaction-sync.service.ts  # 트랜잭션 동기화
│   │   │   ├── sui-rpc.service.ts          # Sui RPC 연동
│   │   │   └── trade.service.ts            # 거래 관리
│   │   └── utils/
│   ├── components/            # React 컴포넌트
│   └── types/                # TypeScript 타입 정의
├── docs/                     # 문서
├── package.json
├── next.config.js
└── tailwind.config.js
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
# pnpm 사용 (권장)
pnpm install

# 또는 npm 사용
npm install
```

### 2. 환경 변수 설정

```bash
# 환경 변수 파일 복사
cp env.local.example .env.local

# .env.local 파일을 편집하여 실제 값으로 변경
```

**필수 환경 변수:**

```bash
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
SUI_RPC_URL="https://fullnode.mainnet.sui.io:443"  # 또는 테스트넷
SUI_NETWORK="mainnet"  # 또는 "testnet"
NODE_ENV="development"
```

### 3. 애플리케이션 실행

```bash
# 개발 모드 실행
pnpm dev

# 프로덕션 빌드
pnpm build
pnpm start
```

## 🌐 접속 URL

애플리케이션 실행 후 다음 URL에서 확인할 수 있습니다:

- **웹 애플리케이션**: http://localhost:3000
- **대시보드**: http://localhost:3000/dashboard
- **API 엔드포인트**: http://localhost:3000/api/\*

### 💡 개발 환경 TIP

첫 번째 API 호출 시 SQLite Mock 데이터베이스가 자동으로 생성되어 즉시 테스트 가능합니다!

```bash
# 첫 API 호출로 Mock DB 생성 + 데이터 확인
curl http://localhost:3000/api/wallet/balance
```

## 🔌 API 엔드포인트

### 사용자 관리 (`/api/users`)

- `POST /api/users` - 사용자 생성
- `GET /api/users` - 모든 사용자 조회
- `GET /api/users/[id]` - 사용자 ID로 조회
- `GET /api/users/wallet/[wallet_address]` - 지갑 주소로 조회
- `DELETE /api/users/[id]` - 사용자 삭제

### 저금고 관리 (`/api/savings-vault`)

- `POST /api/savings-vault` - 저금고 생성
- `GET /api/savings-vault` - 모든 저금고 조회
- `GET /api/savings-vault/[vault_id]` - 저금고 ID로 조회
- `PATCH /api/savings-vault/[vault_id]` - 저금고 수정
- `DELETE /api/savings-vault/[vault_id]` - 저금고 삭제

### 입금 관리 (`/api/deposits`)

- `POST /api/deposits` - 입금 생성
- `GET /api/deposits` - 모든 입금 조회
- `GET /api/deposits/[deposit_id]` - 입금 조회

### 거래 관리 (`/api/trades`)

- `POST /api/trades` - 거래 생성
- `GET /api/trades` - 모든 거래 조회
- `GET /api/trades?recent=true&limit=10` - 최근 거래 조회
- `GET /api/trades?user_id=1` - 사용자별 거래 조회
- `GET /api/trades?vault_id=1` - 저금고별 거래 조회

### 스케줄러 관리 (`/api/scheduler`)

- `GET /api/scheduler` - 스케줄러 상태 조회
- `POST /api/scheduler` - 스케줄러 초기화/수동 동기화
  - `{"action": "initialize"}` - 스케줄러 초기화
  - `{"action": "manual_sync", "limit": 100}` - 수동 동기화
  - `{"action": "test_transaction", "tx_digest": "..."}` - 특정 트랜잭션 테스트

## 📊 API 응답 형식

모든 API는 다음과 같은 일관된 형식으로 응답합니다:

```typescript
// 성공 응답
{
  "success": true,
  "data": { /* 실제 데이터 */ },
  "message": "Success message"
}

// 오류 응답
{
  "success": false,
  "error": "Error message",
  "details": { /* 추가 오류 정보 */ }
}
```

## 🔄 트랜잭션 동기화 시스템

### 자동 동기화 프로세스

1. **사용자 지갑 주소 수집**: 등록된 모든 사용자의 지갑 주소를 가져옵니다
2. **트랜잭션 조회**: 각 지갑 주소별로 Sui RPC를 통해 최근 트랜잭션을 조회합니다
3. **DeepBook 거래 필터링**: 트랜잭션 이벤트에서 DeepBook 관련 거래를 감지합니다
4. **DB 저장**: DeepBook 거래로 확인되면 `trades` 테이블에 자동 저장됩니다

### 지원하는 네트워크

- **메인넷**: `https://fullnode.mainnet.sui.io:443`
- **테스트넷**: `https://fullnode.testnet.sui.io:443`

### 테스트 방법

```bash
# 특정 트랜잭션 분석 (DB 저장 안함)
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test_transaction",
    "tx_digest": "EW3wKriKhoJ7AoDrRLb4HkvXj8Z2xZpsvQ6GbEveNCjd"
  }'

# 트랜잭션 분석 + DB 저장
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test_transaction",
    "tx_digest": "EW3wKriKhoJ7AoDrRLb4HkvXj8Z2xZpsvQ6GbEveNCjd",
    "save_to_db": true
  }'
```

## 🗄️ 데이터베이스 스키마

### 주요 테이블

- `users` - 사용자 정보 (지갑 주소 기반)
- `savings_vault` - DCA 저금고 설정
- `deposits` - 입금 내역
- `trades` - 거래 내역 (DeepBook 동기화 포함)

### 관계도

```
users (1) ←→ (N) savings_vault
users (1) ←→ (N) deposits
users (1) ←→ (N) trades
savings_vault (1) ←→ (N) deposits
savings_vault (1) ←→ (N) trades
```

## 🗃️ Mock 데이터베이스 (SQLite)

개발 및 테스트 환경에서는 **SQLite** 기반의 Mock 데이터베이스를 사용합니다.

### 📍 데이터베이스 파일 위치

- **파일 경로**: `프로젝트루트/mock-data.db`
- **생성 시점**: 첫 번째 API 호출 시 자동 생성

### 🔧 자동 초기화 과정

1. **API 라우트 호출** → Mock 데이터베이스 모듈 import
2. **SQLite 파일 생성** → 프로젝트 루트에 `mock-data.db` 생성
3. **스키마 생성** → 테이블 구조 자동 생성
4. **기본 데이터 삽입** → 초기 지갑 잔액 및 포트폴리오 데이터 삽입

### 📊 Mock 데이터베이스 테이블

```sql
-- 지갑 잔액
wallet_balances (symbol, name, amount, value, price)

-- 포트폴리오 정보
portfolio (total_value, total_invested, total_return, return_rate)

-- 포트폴리오 보유 자산
portfolio_holdings (portfolio_id, asset, amount, value, avg_buy_price, current_price)

-- 거래 내역
transactions (id, type, amount, asset, price, total, date, status, vault_id)

-- DCA 주문
dca_orders (id, frequency, amount, from_asset, to_asset, status, next_execution)
```

### 🔄 Mock 데이터 초기화 API

개발 중 데이터를 초기 상태로 리셋하고 싶을 때 사용합니다:

```bash
# Mock 데이터를 초기 상태로 리셋
curl -X POST http://localhost:3000/api/demo/reset \
  -H "Content-Type: application/json"
```

**응답 예시:**

```json
{
  "success": true,
  "message": "Demo data has been reset successfully",
  "data": {
    "initialBalance": 1000000,
    "currency": "USDC"
  }
}
```

### 💡 초기화 후 데이터 상태

- **USDC 잔액**: 1,000,000 USDC
- **WBTC 잔액**: 0 WBTC
- **SUI 잔액**: 0 SUI
- **포트폴리오**: 총 가치 $1,000,000
- **거래 내역**: 모든 기록 삭제
- **DCA 주문**: 모든 주문 삭제

### 🔗 Mock API 엔드포인트

Mock 데이터베이스를 사용하는 주요 API들:

```bash
# 지갑 잔액 조회
GET /api/wallet/balance

# 포트폴리오 조회
GET /api/portfolio

# 거래 내역 조회
GET /api/transactions

# DCA 주문 조회
GET /api/dca/orders

# DCA 주문 생성
POST /api/dca/orders

# 데모 데이터 리셋
POST /api/demo/reset
```

### ⚠️ 주의사항

- Mock 데이터베이스는 **개발/테스트 전용**입니다
- 운영 환경에서는 **PostgreSQL**을 사용합니다
- `mock-data.db` 파일을 삭제하면 다음 API 호출 시 자동으로 재생성됩니다
- 데이터베이스 파일은 Git에서 무시됩니다 (`.gitignore` 포함)

## 🛠️ 개발 스크립트

```bash
# 개발 서버 실행
pnpm dev

# 타입 체크
pnpm type-check

# 린트 검사
pnpm lint

# 프로덕션 빌드
pnpm build

# 프로덕션 실행
pnpm start
```

## 🔄 마이그레이션 히스토리

### v1.0 → v2.0 (2024-09-20)

- **NestJS** → **Next.js App Router**로 완전 마이그레이션
- 프론트엔드와 백엔드 통합
- API Routes 구조로 변경
- TypeORM 연동 유지
- React 기반 사용자 인터페이스 추가

## 🚧 개발 상태

### ✅ 완료된 기능

- [x] Next.js App Router 프로젝트 구조
- [x] TypeORM + PostgreSQL 데이터베이스
- [x] 사용자 관리 API
- [x] 저금고 관리 API
- [x] 입금/거래 관리 API
- [x] 기본 대시보드 UI
- [x] API Routes 변환 완료
- [x] Sui RPC 서비스 연동
- [x] 트랜잭션 동기화 서비스
- [x] DeepBook 거래 자동 감지
- [x] 스케줄러 API (초기화/수동 동기화/테스트)

### 🔄 진행 중인 기능

- [ ] DeepBook 이벤트 데이터 파싱 로직 완성
- [ ] 실제 거래 금액/토큰 정보 추출
- [ ] 저금고 생성/관리 UI
- [ ] 포트폴리오 대시보드
- [ ] 가격 API 연동

### 📋 예정된 기능

- [ ] Cetus Aggregator 통합
- [ ] 실시간 가격 피드
- [ ] 자동 스케줄링 시스템 (주기적 동기화)
- [ ] CEX 가격 비교
- [ ] 모바일 반응형 UI 개선
- [ ] 트랜잭션 알림 시스템

## 🤝 기여하기

이 프로젝트는 해커톤용 PoC입니다. 기여나 제안사항이 있으시면 이슈를 생성해 주세요.

## 📄 라이선스

ISC
