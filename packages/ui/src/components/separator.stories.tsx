/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Separator orientation',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is decorative',
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default horizontal separator
 * Accessibility: Decorative separators are hidden from screen readers
 */
export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-[var(--bg-muted-foreground)]">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

/**
 * Horizontal separator
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>Content above</div>
      <Separator />
      <div>Content below</div>
    </div>
  ),
};

/**
 * Vertical separator
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div>Left</div>
      <Separator orientation="vertical" />
      <div>Middle</div>
      <Separator orientation="vertical" />
      <div>Right</div>
    </div>
  ),
};

/**
 * In navigation menu
 */
export const Navigation: Story = {
  render: () => (
    <div className="flex items-center space-x-4 text-sm">
      <a href="#" className="hover:underline">
        Home
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="hover:underline">
        About
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="hover:underline">
        Contact
      </a>
    </div>
  ),
};

/**
 * Section divider
 */
export const SectionDivider: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Section 1</h3>
        <p className="text-sm text-[var(--bg-muted-foreground)]">Content for the first section</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold">Section 2</h3>
        <p className="text-sm text-[var(--bg-muted-foreground)]">Content for the second section</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold">Section 3</h3>
        <p className="text-sm text-[var(--bg-muted-foreground)]">Content for the third section</p>
      </div>
    </div>
  ),
};

/**
 * Custom thickness
 */
export const CustomThickness: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>
        <p className="text-sm">Thin separator (default)</p>
        <Separator className="my-2" />
      </div>
      <div>
        <p className="text-sm">Medium separator</p>
        <Separator className="my-2 h-[2px]" />
      </div>
      <div>
        <p className="text-sm">Thick separator</p>
        <Separator className="my-2 h-[4px]" />
      </div>
    </div>
  ),
};
