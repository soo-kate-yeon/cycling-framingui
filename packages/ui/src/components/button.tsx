/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 * @framingui/ui - Button Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 *
 * Forked from: shadcn/ui
 * Token Pattern: 100% var(--*) compliance
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-xl)] text-sm font-medium ring-offset-[var(--bg-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--bg-primary)] text-[var(--bg-primary-foreground)] hover:bg-[var(--bg-primary)]/90',
        destructive:
          'bg-[var(--bg-destructive)] text-[var(--bg-destructive-foreground)] hover:bg-[var(--bg-destructive)]/90',
        outline:
          'border border-[var(--border-input)] bg-[var(--bg-background)] hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)]',
        secondary:
          'bg-[var(--bg-secondary)] text-[var(--bg-secondary-foreground)] hover:bg-[var(--bg-secondary)]/80',
        ghost: 'hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)]',
        link: 'text-[var(--bg-primary)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-[var(--spacing-4)] py-[var(--spacing-2)]',
        sm: 'h-9 rounded-[var(--radius-xl)] px-[var(--spacing-3)]',
        lg: 'h-11 rounded-[var(--radius-xl)] px-[var(--spacing-8)]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
