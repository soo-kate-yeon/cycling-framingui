/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 * @framingui - Tabs Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../lib/utils';
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--bg-muted)] p-1 text-[var(--bg-muted-foreground)]',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-xl)] px-[var(--spacing-3)] py-[var(--spacing-2)] text-sm font-medium ring-offset-[var(--bg-background)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[var(--bg-background)] data-[state=active]:text-[var(--bg-foreground)] data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-[var(--spacing-2)] ring-offset-[var(--bg-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };
//# sourceMappingURL=tabs.js.map
