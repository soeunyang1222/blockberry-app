# Sui DCA (Dollar Cost Averaging) Platform

Kraken의 DCA 기능에서 영감을 받아 Sui 블록체인 위에서 달러 코스트 애버리징(DCA) 도구를 구축하는 NestJS 애플리케이션입니다. Cetus Aggregator를 활용하여 Sui DEX들 사이에서 USDC → Wrapped BTC로 가장 저렴한 스왑을 찾아 실행합니다.

## 🎯 프로젝트 개요

이 PoC는 해커톤용으로 개발된 DCA 플랫폼으로, 다음과 같은 기능을 제공합니다:

- **지갑 연결 및 사용자 관리**
- **BTC 적립 설정 생성** (매수당 USDC 금액, 빈도, 시간)
- **USDC를 스마트 컨트랙트에 예치**
- **자동/스케줄 매수** (PoC에서는 수동 또는 시뮬레이션)
- **누적된 BTC 확인**
- **가상의 CEX 매수와 비교** (업비트/빗썸 고정 시각 매수)
- **사용자 거래내역 표시**
- **"알파" 표시** (가장 저렴한 경로로 얻은 추가 BTC)

## 🏗️ 기술 스택

- **백엔드**: NestJS, TypeScript
- **데이터베이스**: PostgreSQL (Neon Cloud)
- **ORM**: TypeORM
- **API 문서**: Swagger
- **블록체인**: Sui (예정)
- **DEX Aggregator**: Cetus Protocol (예정)
- **가격 API**: Coingecko (예정)

## 🚀 설치 및 설정

### 1. 의존성 설치

```bash
# pnpm 사용 (권장)
pnpm install

# 또는 npm 사용
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 `env.example`을 참고하여 실제 값으로 설정하세요:

```bash
# .env 파일 생성
cp env.example .env

# .env 파일을 편집하여 실제 값으로 변경
```

**중요**: `.env` 파일에는 민감한 정보가 포함되어 있으므로 절대 git에 커밋하지 마세요.

### 3. 애플리케이션 실행

```bash
# 개발 모드 (파일 변경 시 자동 재시작)
pnpm run dev

# 또는
pnpm run start:dev

# 프로덕션 빌드
pnpm run build
pnpm run start:prod
```

## 📚 API 문서

### Swagger UI
애플리케이션 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- **Swagger UI**: http://localhost:3000/api
- **API 서버**: http://localhost:3000

## 🔌 API 엔드포인트

### 메인 API (`/api`)

#### DCA 관리
- `POST /api/create-savings` - 저금고 생성
- `POST /api/deposit` - 입금 처리
- `POST /api/execute-buy` - 매수 실행
- `GET /api/transactions` - 거래 내역 조회
- `GET /api/verify-wallet` - 지갑 주소 검증

### 사용자 관리 (`/users`)
- `POST /users` - 사용자 생성
- `GET /users` - 모든 사용자 조회
- `GET /users/:id` - 사용자 ID로 조회
- `GET /users/wallet/:wallet_address` - 지갑 주소로 조회
- `DELETE /users/:id` - 사용자 삭제

### 저금고 관리 (`/savings-vault`)
- `POST /savings-vault` - 저금고 생성
- `GET /savings-vault` - 모든 저금고 조회
- `GET /savings-vault/:vault_id` - 저금고 ID로 조회
- `GET /savings-vault/user/:user_id` - 사용자별 저금고 조회
- `PATCH /savings-vault/:vault_id/active` - 저금고 활성 상태 변경
- `DELETE /savings-vault/:vault_id` - 저금고 삭제

### 입금 관리 (`/deposits`)
- `POST /deposits` - 입금 생성
- `GET /deposits` - 모든 입금 조회
- `GET /deposits/:deposit_id` - 입금 ID로 조회
- `GET /deposits/user/:user_id` - 사용자별 입금 조회
- `GET /deposits/vault/:vault_id` - 저금고별 입금 조회
- `GET /deposits/balance` - 잔액 조회
- `DELETE /deposits/:deposit_id` - 입금 삭제

### 거래 관리 (`/trades`)
- `POST /trades` - 거래 생성
- `GET /trades` - 모든 거래 조회
- `GET /trades/:trade_id` - 거래 ID로 조회
- `GET /trades/user/:user_id` - 사용자별 거래 조회
- `GET /trades/vault/:vault_id` - 저금고별 거래 조회
- `DELETE /trades/:trade_id` - 거래 삭제

### 사용 예시

#### 사용자 생성
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0x1234567890abcdef..."}'
```

#### 저금고 생성
```bash
curl -X POST http://localhost:3000/api/create-savings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "vault_name": "My Bitcoin Savings",
    "target_token": "BTC",
    "interval_days": 7,
    "amount_fiat": 100000,
    "fiat_symbol": "KRW",
    "duration_days": 365
  }'
```

#### 입금 처리
```bash
curl -X POST http://localhost:3000/api/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "vault_id": 1,
    "user_id": 1,
    "amount_fiat": 100000,
    "fiat_symbol": "KRW",
    "tx_hash": "0xabcdef..."
  }'
```

#### 잔액 조회
```bash
curl "http://localhost:3000/deposits/balance?user_id=1&vault_id=1"
```

## 🗄️ 데이터베이스 스키마

### users 테이블
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | SERIAL PRIMARY KEY | 자동 증가 ID |
| wallet_address | VARCHAR UNIQUE | 지갑 주소 (고유) |
| created_at | TIMESTAMP | 생성일시 |

### savings_vault 테이블
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| vault_id | SERIAL PRIMARY KEY | 자동 증가 ID |
| user_id | INTEGER | 사용자 ID (FK) |
| vault_name | VARCHAR | 저금고 이름 |
| target_token | VARCHAR | 대상 토큰 (예: BTC) |
| interval_days | INTEGER | 간격 일수 |
| amount_fiat | INTEGER | 법정화폐 금액 |
| fiat_symbol | VARCHAR | 법정화폐 심볼 (예: KRW) |
| duration_days | INTEGER | 지속 기간 일수 |
| total_deposit | INTEGER | 총 입금액 |
| active | BOOLEAN | 활성 상태 |
| created_at | TIMESTAMP | 생성일시 |

### deposits 테이블
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| deposit_id | SERIAL PRIMARY KEY | 자동 증가 ID |
| vault_id | INTEGER | 저금고 ID (FK) |
| user_id | INTEGER | 사용자 ID (FK) |
| amount_fiat | INTEGER | 입금 금액 |
| fiat_symbol | VARCHAR | 법정화폐 심볼 |
| tx_hash | VARCHAR | 트랜잭션 해시 |
| created_at | TIMESTAMP | 생성일시 |

### trades 테이블
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| trade_id | SERIAL PRIMARY KEY | 자동 증가 ID |
| vault_id | INTEGER | 저금고 ID (FK) |
| user_id | INTEGER | 사용자 ID (FK) |
| fiat_amount | INTEGER | 법정화폐 금액 |
| fiat_symbol | VARCHAR | 법정화폐 심볼 |
| token_symbol | VARCHAR | 토큰 심볼 |
| token_amount | INTEGER | 토큰 금액 |
| price_executed | INTEGER | 실행 가격 |
| tx_hash | VARCHAR | 트랜잭션 해시 |

### 관계도
```
users (1) ←→ (N) savings_vault
users (1) ←→ (N) deposits
users (1) ←→ (N) trades
savings_vault (1) ←→ (N) deposits
savings_vault (1) ←→ (N) trades
```

## 🛠️ 개발

### 스크립트

- `pnpm run dev` - 개발 모드로 실행 (파일 변경 시 자동 재시작)
- `pnpm run build` - TypeScript 컴파일
- `pnpm run start:prod` - 프로덕션 모드로 실행
- `pnpm run lint` - ESLint로 코드 검사
- `pnpm run test` - 테스트 실행

### 프로젝트 구조

```
src/
├── api/                    # 메인 API 모듈
│   ├── api.controller.ts   # DCA 핵심 API
│   └── api.module.ts
├── users/                  # 사용자 관리 모듈
│   ├── dto/               # 데이터 전송 객체
│   ├── entities/          # TypeORM 엔티티
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── savings-vault/         # 저금고 관리 모듈
│   ├── dto/
│   ├── entities/
│   ├── savings-vault.controller.ts
│   ├── savings-vault.service.ts
│   └── savings-vault.module.ts
├── deposits/              # 입금 관리 모듈
│   ├── dto/
│   ├── entities/
│   ├── deposits.controller.ts
│   ├── deposits.service.ts
│   └── deposits.module.ts
├── trades/                # 거래 관리 모듈
│   ├── dto/
│   ├── entities/
│   ├── trades.controller.ts
│   ├── trades.service.ts
│   └── trades.module.ts
├── blockberry/            # Blockberry API 모듈
│   ├── dto/
│   ├── blockberry.service.ts
│   └── blockberry.module.ts
├── app.module.ts          # 루트 모듈
└── main.ts                # 애플리케이션 진입점
```

## 🚧 개발 상태

### ✅ 완료된 기능
- [x] 기본 데이터베이스 구조 (PostgreSQL + TypeORM)
- [x] 사용자 관리 (지갑 주소 기반)
- [x] 저금고 관리 (DCA 설정)
- [x] 입금/거래 관리
- [x] RESTful API 엔드포인트
- [x] Swagger API 문서화
- [x] Blockberry API 연동 (기본)

### 🔄 진행 중인 기능
- [ ] 가격 API 연동 (Coingecko)
- [ ] DCA 시뮬레이션 로직
- [ ] CEX 가격 비교

### 📋 예정된 기능
- [ ] Sui 블록체인 연동
- [ ] Cetus Aggregator 연동
- [ ] 실제 스마트 컨트랙트 호출
- [ ] 자동 스케줄링 시스템
- [ ] 프론트엔드 UI

## 🤝 기여하기

이 프로젝트는 해커톤용 PoC입니다. 기여나 제안사항이 있으시면 이슈를 생성해 주세요.

## 📄 라이선스

ISC
