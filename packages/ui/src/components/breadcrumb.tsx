/**
 * [TAG-003] Breadcrumb Component - Path navigation component
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: Provides hierarchical navigation context for users
 * IMPACT: Improves navigation UX and site structure understanding
 *
 * @framingui/ui - Breadcrumb Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 *
 * Pattern: Semantic HTML + CVA + Tekton tokens
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const breadcrumbVariants = cva('flex items-center gap-[var(--spacing-2)]', {
  variants: {
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const breadcrumbListVariants = cva('flex flex-wrap items-center gap-1.5 break-words', {
  variants: {},
});

const breadcrumbItemVariants = cva('inline-flex items-center gap-1.5', {
  variants: {},
});

const breadcrumbLinkVariants = cva(
  'transition-colors hover:text-[var(--bg-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]',
  {
    variants: {
      active: {
        true: 'text-[var(--bg-foreground)] font-medium pointer-events-none',
        false: 'text-[var(--text-muted-foreground)] underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

const breadcrumbSeparatorVariants = cva('text-[var(--text-muted-foreground)] select-none', {
  variants: {},
});

const breadcrumbEllipsisVariants = cva(
  'inline-flex h-9 w-9 items-center justify-center text-[var(--text-muted-foreground)]',
  {
    variants: {},
  }
);

export interface BreadcrumbProps
  extends React.ComponentPropsWithoutRef<'nav'>, VariantProps<typeof breadcrumbVariants> {
  /**
   * 구분자 요소 (기본값: "/")
   */
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, size, separator: _separator = '/', ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn(breadcrumbVariants({ size, className }))}
        {...props}
      />
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  ({ className, ...props }, ref) => (
    <ol ref={ref} className={cn(breadcrumbListVariants({ className }))} {...props} />
  )
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(breadcrumbItemVariants({ className }))} {...props} />
  )
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<'a'>, VariantProps<typeof breadcrumbLinkVariants> {
  /**
   * 현재 페이지인지 여부
   */
  active?: boolean;
  /**
   * 자식 컴포넌트로 렌더링
   */
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, active, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'a';

    return (
      <Comp
        ref={asChild ? undefined : ref}
        className={cn(breadcrumbLinkVariants({ active, className }))}
        aria-current={active ? 'page' : undefined}
        {...(asChild ? {} : props)}
      >
        {asChild ? props.children : props.children}
      </Comp>
    );
  }
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        breadcrumbLinkVariants({ active: true }),
        'text-[var(--bg-foreground)]',
        className
      )}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<'li'> {
  /**
   * 구분자로 사용할 요소
   */
  children?: React.ReactNode;
}

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ children, className, ...props }, ref) => (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbSeparatorVariants({ className }))}
      {...props}
    >
      {children ?? '/'}
    </li>
  )
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn(breadcrumbEllipsisVariants({ className }))}
    {...props}
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
    <span className="sr-only">More</span>
  </span>
));
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
