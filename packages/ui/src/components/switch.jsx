/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 * @framingui - Switch Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../lib/utils';
const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-[var(--radius-full)] border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-background)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--bg-primary)] data-[state=unchecked]:bg-[var(--bg-muted)]',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-[var(--radius-full)] bg-[var(--bg-background)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;
export { Switch };
//# sourceMappingURL=switch.js.map
