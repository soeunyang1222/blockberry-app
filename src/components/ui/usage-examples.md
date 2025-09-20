# UI 컴포넌트 사용 예시

## Tabs 컴포넌트

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'

function ExampleTabs() {
  return (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">탭 1</TabsTrigger>
        <TabsTrigger value="tab2">탭 2</TabsTrigger>
        <TabsTrigger value="tab3">탭 3</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tab1" className="mt-4">
        <div className="p-4 bg-gray-50 rounded">
          첫 번째 탭의 내용입니다.
        </div>
      </TabsContent>
      
      <TabsContent value="tab2" className="mt-4">
        <div className="p-4 bg-gray-50 rounded">
          두 번째 탭의 내용입니다.
        </div>
      </TabsContent>
      
      <TabsContent value="tab3" className="mt-4">
        <div className="p-4 bg-gray-50 rounded">
          세 번째 탭의 내용입니다.
        </div>
      </TabsContent>
    </Tabs>
  )
}
```

### 제어된 Tabs

```tsx
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'

function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="details">상세</TabsTrigger>
        <TabsTrigger value="settings" disabled>설정</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        개요 페이지 내용
      </TabsContent>
      
      <TabsContent value="details">
        상세 페이지 내용
      </TabsContent>
      
      <TabsContent value="settings">
        설정 페이지 내용
      </TabsContent>
    </Tabs>
  )
}
```

## Select 컴포넌트

```tsx
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem,
  SelectLabel,
  SelectSeparator 
} from '@/components/ui'

function ExampleSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="옵션을 선택하세요" />
      </SelectTrigger>
      
      <SelectContent>
        <SelectLabel>과일</SelectLabel>
        <SelectItem value="apple">사과</SelectItem>
        <SelectItem value="banana">바나나</SelectItem>
        <SelectItem value="orange">오렌지</SelectItem>
        
        <SelectSeparator />
        
        <SelectLabel>채소</SelectLabel>
        <SelectItem value="carrot">당근</SelectItem>
        <SelectItem value="broccoli">브로콜리</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### 제어된 Select

```tsx
import { useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui'

function ControlledSelect() {
  const [value, setValue] = useState('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="언어를 선택하세요" />
      </SelectTrigger>
      
      <SelectContent>
        <SelectItem value="ko">한국어</SelectItem>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## 주요 특징

### Tabs
- **Accessibility**: ARIA 속성을 통한 접근성 지원
- **키보드 내비게이션**: 탭 키와 화살표 키로 탭 이동
- **제어된/비제어된 모드**: `value`와 `defaultValue` 지원
- **비활성화**: 개별 탭 비활성화 가능

### Select
- **Radix UI 기반**: 안정적이고 접근성이 뛰어난 기본 구조
- **Lucide React 아이콘**: 경량화된 아이콘 라이브러리 사용
- **검색 가능**: 키보드 입력으로 옵션 검색
- **그룹화**: SelectLabel과 SelectSeparator로 옵션 그룹화
- **커스터마이징**: Tailwind CSS 클래스로 스타일 커스터마이징
- **애니메이션**: 부드러운 열기/닫기 애니메이션

## 가져오기

```tsx
// 개별 가져오기
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui'

// 전체 가져오기
import * as UI from '@/components/ui'
```
