/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';
import { cn } from '../lib/utils';

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default navigation menu with simple links
 */
export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Navigation with dropdown menus
 * Accessibility: Supports keyboard navigation with arrow keys
 */
export const WithDropdowns: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-[var(--radius-md)] bg-gradient-to-b from-[var(--bg-muted)]/50 to-[var(--bg-muted)] p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">Featured Product</div>
                    <p className="text-sm leading-tight text-[var(--text-muted-foreground)]">
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/product-1" title="Product 1">
                A powerful solution for your needs
              </ListItem>
              <ListItem href="/product-2" title="Product 2">
                Advanced features and capabilities
              </ListItem>
              <ListItem href="/product-3" title="Product 3">
                Enterprise-grade reliability
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/marketing" title="Marketing">
                Reach your audience effectively
              </ListItem>
              <ListItem href="/analytics" title="Analytics">
                Data-driven insights and reports
              </ListItem>
              <ListItem href="/commerce" title="Commerce">
                Build your online store
              </ListItem>
              <ListItem href="/insights" title="Insights">
                Understand your customers
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/pricing">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Multi-level navigation example
 */
export const MultiLevel: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <ListItem href="/docs" title="Documentation">
                Learn how to integrate our products
              </ListItem>
              <ListItem href="/guides" title="Guides">
                Step-by-step tutorials and examples
              </ListItem>
              <ListItem href="/api" title="API Reference">
                Complete API documentation
              </ListItem>
              <ListItem href="/changelog" title="Changelog">
                Latest updates and releases
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Company</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              <ListItem href="/about" title="About Us">
                Our mission and values
              </ListItem>
              <ListItem href="/team" title="Team">
                Meet the people behind the product
              </ListItem>
              <ListItem href="/careers" title="Careers">
                Join our growing team
              </ListItem>
              <ListItem href="/blog" title="Blog">
                Latest news and insights
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Compact navigation for mobile
 */
export const Compact: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList className="gap-0">
        <NavigationMenuItem>
          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'px-3 py-2 text-xs')}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'px-3 py-2 text-xs')}>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'px-3 py-2 text-xs')}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * ListItem component for dropdown content
 */
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-[var(--radius-md)] p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)] focus:bg-[var(--bg-accent)] focus:text-[var(--bg-accent-foreground)]',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-[var(--text-muted-foreground)]">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

/**
 * Import React for forwardRef
 */
import * as React from 'react';
