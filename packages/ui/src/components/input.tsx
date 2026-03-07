/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 * @framingui/ui - Input Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */

import * as React from 'react';
import { cn } from '../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-input)] bg-[var(--bg-background)] px-[var(--spacing-3)] py-[var(--spacing-2)] text-sm ring-offset-[var(--bg-background)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--bg-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
