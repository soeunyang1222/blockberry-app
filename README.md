# Blockberry App

Blockberry API를 사용하여 계정 정보를 조회하고 PostgreSQL 데이터베이스에 저장하는 NestJS 애플리케이션입니다.

## 기능

- Blockberry API를 통한 계정 정보 조회
- PostgreSQL 데이터베이스에 계정 정보 저장
- RESTful API 엔드포인트 제공
- TypeORM을 사용한 데이터베이스 관리

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=blockberry_db

# Blockberry API Configuration
BLOCKBERRY_API_BASE_URL=https://api.blockberry.one/sui/v1
BLOCKBERRY_API_KEY=your_api_key_here

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 3. PostgreSQL 데이터베이스 설정

PostgreSQL이 설치되어 있고 실행 중인지 확인하세요. 데이터베이스를 생성하세요:

```sql
CREATE DATABASE blockberry_db;
```

### 4. 애플리케이션 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

## API 문서

### Swagger UI
애플리케이션 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- **Swagger UI**: http://localhost:3000/api

## API 엔드포인트

### 계정 관리

- `POST /accounts` - 새 계정 추가 (Blockberry API에서 정보 조회 후 DB 저장)
- `GET /accounts` - 모든 계정 목록 조회
- `GET /accounts/:id` - ID로 계정 조회
- `GET /accounts/address/:address` - 주소로 계정 조회
- `POST /accounts/:address/refresh` - 특정 계정 정보를 Blockberry API에서 다시 조회하여 업데이트
- `DELETE /accounts/:id` - 계정 삭제

### 사용 예시

#### 계정 추가
```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{"accountAddress": "0x1234567890abcdef..."}'
```

#### 계정 목록 조회
```bash
curl http://localhost:3000/accounts
```

#### 특정 계정 조회
```bash
curl http://localhost:3000/accounts/address/0x1234567890abcdef...
```

#### 계정 정보 새로고침
```bash
curl -X POST http://localhost:3000/accounts/0x1234567890abcdef.../refresh
```

## 데이터베이스 스키마

### accounts 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | SERIAL PRIMARY KEY | 자동 증가 ID |
| accountAddress | VARCHAR UNIQUE | 계정 주소 (고유) |
| accountName | VARCHAR | 계정 이름 |
| accountImg | VARCHAR | 계정 이미지 URL |
| securityMessage | TEXT | 보안 메시지 |
| createdAt | TIMESTAMP | 생성일시 |
| updatedAt | TIMESTAMP | 수정일시 |

## 개발

### 스크립트

- `npm run start:dev` - 개발 모드로 실행 (파일 변경 시 자동 재시작)
- `npm run build` - TypeScript 컴파일
- `npm run start:prod` - 프로덕션 모드로 실행
- `npm run lint` - ESLint로 코드 검사
- `npm run test` - 테스트 실행

### 프로젝트 구조

```
src/
├── account/                 # 계정 관련 모듈
│   ├── dto/                # 데이터 전송 객체
│   ├── entities/           # TypeORM 엔티티
│   ├── account.controller.ts
│   ├── account.service.ts
│   └── account.module.ts
├── blockberry/             # Blockberry API 모듈
│   ├── dto/                # API 응답 DTO
│   ├── blockberry.service.ts
│   └── blockberry.module.ts
├── app.module.ts           # 루트 모듈
└── main.ts                 # 애플리케이션 진입점
```

## 라이선스

ISC
