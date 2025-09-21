# 🚀 SuiStack - Sui DCA Platform

**Next.js 풀스택 애플리케이션**으로 구축된 Sui 블록체인 기반 달러 코스트 애버리징(DCA) 플랫폼입니다. DeepBook V3를 활용하여 USDC에서 BTC/SUI로 자동화된 정액 분할 매수를 제공합니다.

_[English README](./README_EN.md)_

## 🎯 프로젝트 개요

SuiStack은 Sui 생태계의 강력한 DeepBook V3 프로토콜을 활용한 Non-custodial DCA 플랫폼입니다:

- **Sui 지갑 연결 및 사용자 관리**
- **DCA 저금고 생성** (매수 금액, 주기, 대상 토큰 설정)
- **Balance Manager 기반 자금 관리**
- **TradeCap 위임을 통한 자동 거래**
- **실시간 거래 내역 추적**
- **USDC → BTC/SUI 자동 매수**
- **투명한 성과 분석 및 리포팅**
- **완전 자동화된 스케줄 실행**

## 🏗️ 기술 스택

### 🚀 현재 아키텍처 (2024-09-21)

**Enterprise-grade** Next.js 풀스택 애플리케이션으로 구축된 완전한 DCA 생태계:

```yaml
Frontend & Backend:
  - Next.js 14+ (App Router)
  - React 18 + TypeScript
  - Tailwind CSS + Radix UI
  - React Query (TanStack Query)

Database & ORM:
  - PostgreSQL (Neon Cloud)
  - TypeORM with Full Entity Relations

Blockchain Integration:
  - Sui Network (Devnet/Mainnet)
  - DeepBook V3 SDK
  - Sui dApp Kit & Wallet Standard

Development & Deployment:
  - TypeScript with Strict Mode
  - ESLint + Prettier
  - pnpm Package Manager
  - Bull Queue for Background Jobs
```

## 📁 프로젝트 구조

```
suistack-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── dca/           # DCA 관련 API
│   │   │   │   ├── balance-manager/
│   │   │   │   ├── deposit/
│   │   │   │   ├── execute/
│   │   │   │   └── trade/
│   │   │   ├── users/         # 사용자 관리
│   │   │   ├── savings-vault/ # 저금고 관리
│   │   │   └── trades/        # 거래 내역
│   │   ├── dashboard/         # DCA 대시보드
│   │   ├── dca/              # DCA 설정 페이지
│   │   ├── investment/       # 투자 포트폴리오
│   │   └── api-docs/         # Swagger 문서
│   ├── components/           # React 컴포넌트
│   │   ├── dca/             # DCA 관련 UI
│   │   ├── investment/      # 투자 관련 UI
│   │   ├── dashboard/       # 대시보드 UI
│   │   ├── wallet/          # 지갑 연결 UI
│   │   └── ui/              # 공통 UI 컴포넌트
│   ├── lib/                 # 라이브러리 & 유틸리티
│   │   ├── database/        # TypeORM 설정 & 엔티티
│   │   ├── deepbook/        # DeepBook V3 통합
│   │   └── services/        # 비즈니스 로직
│   ├── hooks/               # React Hooks
│   ├── providers/           # Context Providers
│   └── types/               # TypeScript 타입 정의
├── docs/                    # 프로젝트 문서
├── ref/                     # 참조 구현 예시
└── 설정 파일들...
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
SUI_NETWORK="devnet"
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

SuiStack 플랫폼의 주요 인터페이스:

- **🏠 홈페이지**: http://localhost:3000
- **📊 대시보드**: http://localhost:3000/dashboard
- **💰 DCA 설정**: http://localhost:3000/dca
- **📈 투자 포트폴리오**: http://localhost:3000/investment
- **📚 API 문서**: http://localhost:3000/api-docs (Swagger UI)

## 🔌 API 엔드포인트

### DCA 핵심 API (`/api/dca`)

- `POST /api/dca/balance-manager` - Balance Manager 생성
- `POST /api/dca/deposit` - USDC 예치 및 TradeCap 위임
- `POST /api/dca/trade` - 수동 거래 실행
- `POST /api/dca/execute` - DCA 주문 실행 (자동화)

### 사용자 관리 (`/api/users`)

- `POST /api/users` - 사용자 생성 (지갑 기반)
- `GET /api/users` - 사용자 목록 조회
- `GET /api/users/[id]` - 사용자 상세 조회
- `GET /api/users/wallet/[wallet_address]` - 지갑으로 사용자 조회

### 저금고 관리 (`/api/savings-vault`)

- `POST /api/savings-vault` - DCA 저금고 생성
- `GET /api/savings-vault` - 사용자별 저금고 조회
- `GET /api/savings-vault/[vault_id]` - 저금고 상세 정보
- `PATCH /api/savings-vault/[vault_id]` - 저금고 설정 수정

### 거래 내역 (`/api/trades`)

- `GET /api/trades` - 거래 내역 조회
- `GET /api/trades/[trade_id]` - 거래 상세 정보
- `POST /api/trades` - 거래 기록 생성

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

## 🗄️ 데이터베이스 스키마

### 핵심 엔티티

- **`users`** - 사용자 정보 (Sui 지갑 주소 기반)
- **`savings_vault`** - DCA 설정 및 저금고 관리
- **`trades`** - 거래 내역 및 성과 추적
- **`balance_managers`** - DeepBook Balance Manager 관리 (예정)
- **`dca_orders`** - 자동화된 DCA 주문 관리 (예정)

### 엔티티 관계도

```mermaid
erDiagram
    users ||--o{ savings_vault : "owns"
    users ||--o{ trades : "executes"
    savings_vault ||--o{ trades : "generates"
    users ||--o{ balance_managers : "manages"
    balance_managers ||--o{ dca_orders : "executes"
    dca_orders ||--o{ trades : "creates"
```

### 주요 필드

- **Users**: `wallet_address` (unique), `virtual_account_address`
- **SavingsVault**: 매수 금액, 주기, 대상 토큰, 실행 상태
- **Trades**: 거래량, 가격, 수수료, 블록체인 해시

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

## 🔄 프로젝트 진화

### v2.0 → v3.0 (2024-09-21) - SuiStack 리브랜딩

- **Blockberry** → **SuiStack** 서비스명 변경
- **DeepBook V3** 프로토콜 통합 시작
- **Balance Manager** 아키텍처 도입
- Enterprise-grade 기능 강화

### v1.0 → v2.0 (2024-09-20)

- **NestJS** → **Next.js 풀스택** 마이그레이션
- 통합 프론트엔드/백엔드 아키텍처
- React 기반 현대적 UI/UX

## 🚧 현재 개발 상태

### ✅ 완료된 기능 (Production Ready)

- [x] **프레임워크**: Next.js 14 + App Router
- [x] **데이터베이스**: PostgreSQL + TypeORM
- [x] **사용자 관리**: 지갑 연결 및 계정 시스템
- [x] **DCA 설정**: 저금고 생성 및 관리 API
- [x] **UI 컴포넌트**: Tailwind + Radix UI 시스템
- [x] **지갑 통합**: Sui Wallet Standard 연결

### 🔄 개발 중인 기능 (In Progress)

- [ ] **DeepBook V3**: Balance Manager 구현
- [ ] **자동화**: DCA 주문 실행 시스템
- [ ] **거래 엔진**: USDC → BTC/SUI 스왑
- [ ] **포트폴리오**: 성과 추적 대시보드

### 📋 백로그 (Planned)

- [ ] **실시간 데이터**: 가격 피드 통합
- [ ] **알림 시스템**: Discord/Telegram 봇
- [ ] **고급 분석**: CEX vs DEX 성과 비교
- [ ] **모바일 최적화**: PWA 지원
- [ ] **보안 강화**: Multi-sig 지원

## 🤝 기여하기

SuiStack은 Sui 생태계의 DCA 솔루션으로 지속적으로 발전하고 있습니다:

### 💡 기여 방식

- **이슈 제출**: 버그 리포트나 기능 제안
- **Pull Request**: 코드 개선이나 새로운 기능
- **문서화**: API 문서나 사용자 가이드 개선
- **테스트**: 다양한 환경에서의 테스트 결과 공유

### 🎯 우선순위 영역

1. **DeepBook V3 통합** - Balance Manager 구현
2. **자동화 시스템** - 스케줄러 및 실행 엔진
3. **UI/UX 개선** - 사용자 경험 최적화
4. **성능 최적화** - 대용량 처리 및 응답성

---

## 📄 라이선스

MIT License - 오픈소스 프로젝트로 자유롭게 사용, 수정, 배포 가능합니다.

---

### 🚀 SuiStack과 함께 Sui 생태계의 미래를 만들어보세요!
