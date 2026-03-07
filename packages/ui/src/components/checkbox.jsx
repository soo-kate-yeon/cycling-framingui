/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 * @framingui - Checkbox Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
// eslint-disable-next-line no-unused-vars
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-[var(--radius-sm)] border border-[var(--border-input)] ring-offset-[var(--bg-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--bg-primary)] data-[state=checked]:text-[var(--bg-primary-foreground)]',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export { Checkbox };
//# sourceMappingURL=checkbox.js.map
