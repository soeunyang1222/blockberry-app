# SuiStack 프론트엔드 개발 가이드

## 📋 개요

이 문서는 SuiStack DCA 플랫폼의 프론트엔드 코드를 이해하고 개발하는 데 필요한 가이드입니다.
주니어 개발자들이 코드를 이해하고 기여할 수 있도록 상세한 설명을 포함하고 있습니다.

## 🏗️ 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지들
│   ├── page.tsx           # 메인 랜딩 페이지 (DCA 주문 생성)
│   ├── investment/        # 포트폴리오 페이지
│   └── dev/              # 개발자 테스트 페이지
├── components/            # 재사용 가능한 UI 컴포넌트들
│   ├── layout/           # 레이아웃 관련 컴포넌트
│   └── ui/               # 기본 UI 컴포넌트 (버튼, 카드 등)
└── lib/
    └── mock/             # 목 데이터 (개발/테스트용)
```

## 🎨 주요 UI 업데이트 내용

### 1. 메인 랜딩 페이지 (`src/app/page.tsx`)

**변경 사항:**

- 기존의 단순한 소개 페이지에서 실제 DCA 주문 생성 폼으로 변경
- 사용자가 투자 주기, 금액, 전략을 선택할 수 있는 인터랙티브한 UI 구현

**주요 기능:**

```tsx
// DCA 폼 상태 관리
const [selectedStrategy, setSelectedStrategy] = useState<'btc' | 'sui'>('btc');
const [frequency, setFrequency] = useState<'week' | 'month' | 'year'>('week');
const [amount, setAmount] = useState<number>(0);
```

**왜 이렇게 변경했나요?**

- 사용자가 첫 방문에서 바로 DCA 주문을 생성할 수 있도록 UX 개선
- 실시간 총 투자 금액 계산으로 사용자에게 명확한 정보 제공
- 목 데이터를 활용하여 실제 잔액 체크 기능 구현

### 2. 포트폴리오 페이지 (`src/app/investment/page.tsx`)

**변경 사항:**

- 복잡한 컴포넌트 구조를 단일 페이지로 통합
- 도넛 차트를 순수 SVG로 구현하여 외부 라이브러리 의존성 제거

**주요 개선점:**

```tsx
// 포트폴리오 구성 비율 계산
const btcPercentage = btcHolding ? (btcHolding.value / mockPortfolio.totalValue * 100).toFixed(2) : '0';
const usdPercentage = (100 - parseFloat(btcPercentage)).toFixed(2);
```

**SVG 도넛 차트 구현:**

```tsx
<circle
  cx="100" cy="100" r="80"
  fill="none" stroke="#3b82f6" strokeWidth="20"
  strokeDasharray={`${(parseFloat(btcPercentage) / 100) * 502} 502`}
  strokeLinecap="round"
/>
```

**왜 이렇게 변경했나요?**

- 외부 차트 라이브러리 없이도 깔끔한 시각화 구현
- 목 데이터와 완벽히 연동되는 실시간 업데이트
- 탭 기반 UI로 정기 주문과 거래 내역을 명확히 분리

### 3. 헤더 컴포넌트 (`src/components/layout/Header.tsx`)

**변경 사항:**

- SuiStack 로고를 인라인 SVG로 교체
- 네비게이션 메뉴를 실제 기능에 맞게 재구성

**로고 구현:**

```tsx
<svg width="32" height="32" viewBox="0 0 100 100">
  <g transform="translate(0, -5)">
    {/* 스택형 블록들 - 안정적이고 부드러운 성장을 상징 */}
    <rect x="25" y="70" width="50" height="20" rx="8" fill="#6ECF28"/>
    {/* ... 추가 블록들 */}
  </g>
</svg>
```

**왜 이렇게 변경했나요?**

- 브랜드 일관성을 위해 전용 로고 사용
- SVG 인라인 방식으로 로딩 속도 최적화
- 개발자 페이지 링크 추가로 개발 편의성 향상

## 🛠️ 개발자 테스트 페이지 (`src/app/dev/page.tsx`)

**새로 추가된 기능:**

- Sui 블록체인 Move 컨트랙트 테스트 인터페이스
- Balance Manager 생성, USDC 예금, 거래 실행 시뮬레이션
- 커스텀 컨트랙트 함수 호출 기능

**주요 구현:**

```tsx
// 비동기 테스트 함수 예시
const testCreateBalanceManager = async () => {
  setIsLoading(true);
  addLog('Balance Manager 생성 시작...');

  try {
    // 실제 Sui 트랜잭션 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    addLog(`✅ Balance Manager 생성 완료: ${mockTxHash}`);
  } catch (error) {
    addLog(`❌ 오류 발생: ${error}`);
  } finally {
    setIsLoading(false);
  }
};
```

**왜 이 페이지를 만들었나요?**

- 블록체인 통합 전 프론트엔드 로직 검증
- 개발자가 UI 플로우를 쉽게 테스트할 수 있는 환경 제공
- 실제 트랜잭션 없이도 전체 사용자 여정 시뮬레이션 가능

## 💾 목 데이터 활용 (`src/lib/mock/data.ts`)

**데이터 구조:**

```tsx
export const mockWalletBalances: WalletBalance[] = [
  {
    asset: 'USDC',
    symbol: 'USDC',
    amount: 1000000,  // 1,000,000 달러 (100만 달러)
    value: 1000000
  }
];

export const mockPortfolio: PortfolioData = {
  totalValue: 1002175,
  totalInvested: 1000000,
  totalReturn: 2175,
  returnRate: 0.2175
};
```

**활용 방법:**

- 실제 API 연동 전 UI 개발 및 테스트
- 다양한 시나리오 데이터로 엣지 케이스 검증
- 백엔드 개발과 독립적인 프론트엔드 개발 가능

## 🎯 개발 시 주의사항

### 1. 상태 관리

```tsx
// ✅ 좋은 예: 명확한 타입과 초기값
const [amount, setAmount] = useState<number>(0);
const [selectedAmountButton, setSelectedAmountButton] = useState<number | null>(null);

// ❌ 피해야 할 예: 타입이 불명확하거나 undefined 가능성
const [amount, setAmount] = useState();
```

### 2. 조건부 렌더링

```tsx
// ✅ 좋은 예: 명확한 조건 체크
{isOverBudget && (
  <p className="text-sm text-red-500 mt-1">
    You can spend up to ${usdcBalance.toLocaleString()}
  </p>
)}

// ❌ 피해야 할 예: 불필요한 삼항 연산자
{isOverBudget ? (
  <p>...</p>
) : null}
```

### 3. 이벤트 핸들러

```tsx
// ✅ 좋은 예: 명확한 함수명과 타입
const handleAmountSelect = (value: number) => {
  setAmount(value);
  setSelectedAmountButton(value);
};

// ❌ 피해야 할 예: 인라인 함수나 불명확한 이름
onClick={(e) => { /* 복잡한 로직 */ }}
```

## 🔧 개발 환경 설정

### 필요한 도구

- Node.js 18+
- pnpm (패키지 매니저)
- TypeScript 지식
- Tailwind CSS 이해

### 로컬 개발 실행

```bash
pnpm install
pnpm dev
```

### 코드 스타일

- TypeScript 엄격 모드 사용
- Tailwind CSS 클래스 순서 준수
- 컴포넌트 상단에 한글 주석으로 설명 추가

## 📚 추가 학습 자료

### React/Next.js

- [Next.js App Router 공식 문서](https://nextjs.org/docs)
- [React Hooks 사용법](https://react.dev/reference/react)

### Tailwind CSS

- [Tailwind CSS 유틸리티 클래스](https://tailwindcss.com/docs)
- [반응형 디자인 가이드](https://tailwindcss.com/docs/responsive-design)

### TypeScript

- [TypeScript 기초](https://www.typescriptlang.org/docs/)
- [React와 TypeScript](https://react-typescript-cheatsheet.netlify.app/)

## 🤝 기여 가이드

### 코드 리뷰 체크리스트

- [ ] 컴포넌트 상단에 한글 주석 추가
- [ ] TypeScript 타입 명시
- [ ] 반응형 디자인 고려
- [ ] 에러 핸들링 구현
- [ ] 로딩 상태 처리
- [ ] 접근성(a11y) 고려

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
style: UI 스타일링 변경
refactor: 코드 리팩토링
docs: 문서 업데이트
```

---

이 가이드를 통해 SuiStack 프론트엔드 개발에 빠르게 적응하고 기여할 수 있기를 바랍니다!
질문이 있다면 언제든 팀에 문의해 주세요. 🚀
