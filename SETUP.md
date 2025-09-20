# 프로젝트 설정 가이드

## 1. 환경 변수 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 환경 변수 파일 생성
cp env.example .env

# 생성된 .env 파일을 편집하여 실제 값으로 변경하세요
# DB_HOST=your_actual_host
# DB_PASSWORD=your_actual_password  
# BLOCKBERRY_API_KEY=your_actual_api_key
```

**⚠️ 보안 주의사항**: 
- `.env` 파일에는 민감한 정보가 포함되어 있습니다
- 절대 `.env` 파일을 git에 커밋하지 마세요
- `env.example` 파일만 참고용으로 사용하세요

## 2. PostgreSQL 데이터베이스 설정

### PostgreSQL 설치 (Windows)
1. [PostgreSQL 공식 사이트](https://www.postgresql.org/download/windows/)에서 다운로드
2. 설치 시 비밀번호를 설정하고 기억해두세요
3. 설치 완료 후 pgAdmin 또는 psql을 사용하여 데이터베이스 생성

### 데이터베이스 생성
```sql
-- psql 또는 pgAdmin에서 실행
CREATE DATABASE blockberry_db;
```

### .env 파일의 데이터베이스 설정 수정
```env
DB_PASSWORD=설치시_설정한_비밀번호
```

## 3. Blockberry API 키 설정

1. [Blockberry API 문서](https://docs.blockberry.one/)에서 API 키를 발급받으세요
2. `.env` 파일의 `BLOCKBERRY_API_KEY` 값을 실제 API 키로 변경하세요

## 4. 애플리케이션 실행

```bash
# 개발 모드로 실행
pnpm run start:dev

# 또는 npm 사용
npm run start:dev
```

## 5. API 테스트

애플리케이션이 실행되면 다음 URL에서 API를 테스트할 수 있습니다:

- **Swagger UI**: http://localhost:3000/api
- **계정 추가**: POST http://localhost:3000/accounts
- **계정 목록**: GET http://localhost:3000/accounts

### Swagger UI 사용법
1. 브라우저에서 http://localhost:3000/api 접속
2. 각 API 엔드포인트를 클릭하여 상세 정보 확인
3. "Try it out" 버튼을 클릭하여 실제 API 테스트 가능
4. 요청/응답 예시와 스키마 정보 확인 가능

### 예시 요청 (curl)
```bash
# 계정 추가
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{"accountAddress": "0x1234567890abcdef..."}'

# 계정 목록 조회
curl http://localhost:3000/accounts
```

## 6. 문제 해결

### 데이터베이스 연결 오류
- PostgreSQL이 실행 중인지 확인
- 데이터베이스 이름, 사용자명, 비밀번호가 올바른지 확인
- 방화벽 설정 확인

### API 키 오류
- Blockberry API 키가 유효한지 확인
- API 키에 적절한 권한이 있는지 확인

### 포트 충돌
- 3000번 포트가 사용 중인 경우 `.env` 파일에서 `PORT` 값을 변경
