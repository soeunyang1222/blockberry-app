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

## 🏗️ 기술 스택

### 🚀 최신 업데이트 (2024-09-20)

프로젝트가 **NestJS**에서 **Next.js 풀스택 애플리케이션**으로 마이그레이션되었습니다!

```yaml
Frontend & Backend:
  - Next.js 14+ (App Router)
  - React 18 + TypeScript
  - Tailwind CSS

Database & ORM:
  - PostgreSQL (Neon Cloud)
  - TypeORM

Blockchain:
  - Sui Network
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
│   │   │   └── trades/
│   │   ├── dashboard/         # DCA 대시보드 페이지들
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 홈페이지
│   ├── lib/                   # 라이브러리 & 유틸리티
│   │   ├── database/          # TypeORM 설정 & 엔티티
│   │   ├── services/          # 비즈니스 로직
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

애플리케이션 실행 후 다음 URL에서 확인할 수 있습니다:

- **웹 애플리케이션**: http://localhost:3000
- **대시보드**: http://localhost:3000/dashboard
- **API 엔드포인트**: http://localhost:3000/api/*

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
- `GET /api/trades/[trade_id]` - 거래 조회

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

### 주요 테이블
- `users` - 사용자 정보 (지갑 주소 기반)
- `savings_vault` - DCA 저금고 설정
- `deposits` - 입금 내역
- `trades` - 거래 내역

### 관계도
```
users (1) ←→ (N) savings_vault
users (1) ←→ (N) deposits  
users (1) ←→ (N) trades
savings_vault (1) ←→ (N) deposits
savings_vault (1) ←→ (N) trades
```

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

### 🔄 진행 중인 기능
- [ ] 입금/거래 API Routes 완성
- [ ] 저금고 생성/관리 UI
- [ ] 포트폴리오 대시보드
- [ ] 가격 API 연동

### 📋 예정된 기능
- [ ] Sui 블록체인 연동
- [ ] Cetus Aggregator 통합
- [ ] 실시간 가격 피드
- [ ] 자동 스케줄링 시스템
- [ ] CEX 가격 비교
- [ ] 모바일 반응형 UI 개선

## 🤝 기여하기

이 프로젝트는 해커톤용 PoC입니다. 기여나 제안사항이 있으시면 이슈를 생성해 주세요.

## 📄 라이선스

ISC