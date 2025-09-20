import React, { createContext, useContext, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Tabs Context
interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs 컴포넌트는 Tabs 내부에서 사용되어야 합니다')
  }
  return context
}

// Tabs Props
interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: ReactNode
}

// Tabs 메인 컴포넌트
const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  className,
  children
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  
  const activeTab = value !== undefined ? value : internalValue
  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// TabsList Props
interface TabsListProps {
  className?: string
  children: ReactNode
}

// TabsList 컴포넌트
const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-foreground-muted',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

// TabsTrigger Props
interface TabsTriggerProps {
  value: string
  className?: string
  disabled?: boolean
  children: ReactNode
}

// TabsTrigger 컴포넌트
const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  disabled = false,
  children
}) => {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-foreground-muted hover:bg-background/50 hover:text-foreground',
        className
      )}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
    >
      {children}
    </button>
  )
}

// TabsContent Props
interface TabsContentProps {
  value: string
  className?: string
  children: ReactNode
}

// TabsContent 컴포넌트
const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children
}) => {
  const { activeTab } = useTabsContext()
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className
      )}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
