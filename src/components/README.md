# 🧩 Components 구조 가이드

이 폴더는 React 컴포넌트들을 체계적으로 구성하여 재사용성과 유지보수성을 높입니다.

## 📁 폴더 구조

```
src/components/
├── ui/                     # 기본 UI 컴포넌트 (Design System)
│   ├── Button.tsx         # 버튼 컴포넌트
│   ├── Card.tsx           # 카드 컴포넌트
│   ├── Input.tsx          # 입력 필드
│   ├── Modal.tsx          # 모달/다이얼로그
│   └── index.ts           # 모든 UI 컴포넌트 export
├── layout/                # 레이아웃 관련 컴포넌트
│   ├── Header.tsx         # 상단 헤더
│   ├── Footer.tsx         # 하단 푸터
│   ├── Sidebar.tsx        # 사이드바
│   └── Navigation.tsx     # 네비게이션
├── dashboard/             # 대시보드 관련 컴포넌트
│   ├── StatsCard.tsx      # 통계 카드
│   ├── DCAChart.tsx       # DCA 차트
│   └── PortfolioSummary.tsx
├── savings/               # 저금고 관련 컴포넌트
│   ├── VaultCard.tsx      # 저금고 카드
│   ├── CreateVaultForm.tsx
│   └── VaultSettings.tsx
├── trades/                # 거래 관련 컴포넌트
│   ├── TradeHistory.tsx
│   ├── ExecuteBuyButton.tsx
│   └── TransactionList.tsx
└── wallet/                # 지갑 관련 컴포넌트
    ├── WalletConnect.tsx
    ├── WalletInfo.tsx
    └── AddressVerifier.tsx
```

## 🎯 컴포넌트 분류 기준

### 1. **UI 컴포넌트** (`ui/`)
- 순수한 UI 요소
- 비즈니스 로직 없음
- 재사용성 높음
- props로 모든 데이터 전달

**예시:**
```tsx
// ✅ 좋은 예
<Button variant="primary" size="lg" onClick={handleClick}>
  클릭하세요
</Button>

// ❌ 나쁜 예 (비즈니스 로직 포함)
<SubmitTradeButton tradeId={123} />
```

### 2. **기능별 컴포넌트** (`dashboard/`, `savings/` 등)
- 특정 도메인에 특화
- 비즈니스 로직 포함 가능
- API 호출 포함 가능

**예시:**
```tsx
// ✅ 좋은 예
<VaultCard 
  vault={vaultData} 
  onEdit={handleEdit}
  onToggleActive={handleToggle}
/>
```

### 3. **레이아웃 컴포넌트** (`layout/`)
- 페이지 구조 관련
- 공통 레이아웃 요소
- 네비게이션, 헤더, 푸터 등

## 📝 컴포넌트 작성 규칙

### 1. **파일 명명 규칙**
- PascalCase 사용: `VaultCard.tsx`
- 컴포넌트명과 파일명 일치
- 인덱스 파일: `index.ts`

### 2. **컴포넌트 구조**
```tsx
// 1. Import 순서
import { useState } from 'react';           // React
import { Card } from '@/components/ui';     // 내부 컴포넌트
import { api } from '@/lib/api';           // 유틸리티

// 2. 인터페이스 정의
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

// 3. 컴포넌트 정의
export function ComponentName({ title, onAction }: ComponentProps) {
  // 로직
  
  return (
    // JSX
  );
}
```

### 3. **Props 타입 정의**
```tsx
// ✅ 좋은 예
interface VaultCardProps {
  vault: {
    id: number;
    name: string;
    active: boolean;
  };
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

// ❌ 나쁜 예
interface VaultCardProps {
  data: any;
  callback: Function;
}
```

## 🔄 Import/Export 패턴

### 1. **UI 컴포넌트 사용**
```tsx
// ✅ 권장: 인덱스에서 import
import { Button, Card, CardContent } from '@/components/ui';

// ❌ 비권장: 개별 파일에서 import
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

### 2. **기능 컴포넌트 사용**
```tsx
// ✅ 직접 import
import { VaultCard } from '@/components/savings/VaultCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
```

## 🏗️ 컴포넌트 만들기 예시

새로운 컴포넌트를 만들 때는 다음 위치에 생성하세요:

```bash
# UI 컴포넌트
src/components/ui/NewComponent.tsx

# 대시보드 컴포넌트  
src/components/dashboard/NewDashboardComponent.tsx

# 저금고 컴포넌트
src/components/savings/NewSavingsComponent.tsx
```

이 구조를 따르면 코드의 가독성과 유지보수성이 크게 향상됩니다! 🚀
