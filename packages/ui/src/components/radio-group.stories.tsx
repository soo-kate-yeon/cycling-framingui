/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default radio group
 * Accessibility: RadioGroup provides proper ARIA attributes and keyboard navigation
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one" className="cursor-pointer">
          Option One
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two" className="cursor-pointer">
          Option Two
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three" className="cursor-pointer">
          Option Three
        </Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * With labels and descriptions
 */
export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="default" id="r1" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r1" className="cursor-pointer">
            Default
          </Label>
          <p className="text-sm text-[var(--bg-muted-foreground)]">
            The default spacing for your content.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="comfortable" id="r2" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r2" className="cursor-pointer">
            Comfortable
          </Label>
          <p className="text-sm text-[var(--bg-muted-foreground)]">More space between elements.</p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="compact" id="r3" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r3" className="cursor-pointer">
            Compact
          </Label>
          <p className="text-sm text-[var(--bg-muted-foreground)]">
            Minimal spacing between elements.
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

/**
 * Disabled options
 * Accessibility: Disabled items are properly marked for assistive technologies
 */
export const DisabledOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="enabled">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="enabled" id="enabled" />
        <Label htmlFor="enabled" className="cursor-pointer">
          Enabled option
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="disabled" id="disabled" disabled />
        <Label htmlFor="disabled" className="cursor-not-allowed opacity-70">
          Disabled option
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="another" id="another" />
        <Label htmlFor="another" className="cursor-pointer">
          Another option
        </Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Form example
 */
export const FormExample: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Notification preferences</h3>
        <RadioGroup defaultValue="all">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">
              All new messages
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mentions" id="mentions" />
            <Label htmlFor="mentions" className="cursor-pointer">
              Direct messages and mentions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="cursor-pointer">
              Nothing
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};

/**
 * Payment method selection
 */
export const PaymentMethod: Story = {
  render: () => (
    <RadioGroup defaultValue="card">
      <div className="flex items-start space-x-2 rounded-lg border p-4">
        <RadioGroupItem value="card" id="card" className="mt-1" />
        <div className="grid gap-1.5 leading-none flex-1">
          <Label htmlFor="card" className="cursor-pointer font-medium">
            Credit Card
          </Label>
          <p className="text-sm text-[var(--bg-muted-foreground)]">Pay with credit or debit card</p>
        </div>
      </div>
      <div className="flex items-start space-x-2 rounded-lg border p-4">
        <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
        <div className="grid gap-1.5 leading-none flex-1">
          <Label htmlFor="paypal" className="cursor-pointer font-medium">
            PayPal
          </Label>
          <p className="text-sm text-[var(--bg-muted-foreground)]">Pay with your PayPal account</p>
        </div>
      </div>
      <div className="flex items-start space-x-2 rounded-lg border p-4">
        <RadioGroupItem value="bank" id="bank" className="mt-1" />
        <div className="grid gap-1.5 leading-none flex-1">
          <Label htmlFor="bank" className="cursor-pointer font-medium">
            Bank Transfer
          </Label>
          <p className="text-sm text-[var(--bg-muted-foreground)]">Pay via bank transfer</p>
        </div>
      </div>
    </RadioGroup>
  ),
};

/**
 * Horizontal layout
 */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one" className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="h1" />
        <Label htmlFor="h1" className="cursor-pointer">
          Option 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="h2" />
        <Label htmlFor="h2" className="cursor-pointer">
          Option 2
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="h3" />
        <Label htmlFor="h3" className="cursor-pointer">
          Option 3
        </Label>
      </div>
    </RadioGroup>
  ),
};
