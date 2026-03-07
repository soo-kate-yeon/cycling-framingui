/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */
import * as React from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';
const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable checkbox interaction',
    },
  },
};
export default meta;
/**
 * Default checkbox
 * Accessibility: Always use with a label for screen readers
 */
export const Default = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="cursor-pointer">
        Accept terms and conditions
      </Label>
    </div>
  ),
};
/**
 * Checked state
 */
export const Checked = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked" className="cursor-pointer">
        Already accepted
      </Label>
    </div>
  ),
};
/**
 * Disabled state
 * Accessibility: Disabled checkboxes are not keyboard accessible
 */
export const Disabled = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked" className="cursor-not-allowed opacity-70">
          Disabled unchecked
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked" className="cursor-not-allowed opacity-70">
          Disabled checked
        </Label>
      </div>
    </div>
  ),
};
/**
 * Multiple checkboxes
 */
export const Multiple = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1" className="cursor-pointer">
          Option 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <Label htmlFor="option2" className="cursor-pointer">
          Option 2
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3" className="cursor-pointer">
          Option 3
        </Label>
      </div>
    </div>
  ),
};
/**
 * Form example with description
 */
export const FormExample = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" />
          <Label htmlFor="marketing" className="cursor-pointer">
            Marketing emails
          </Label>
        </div>
        <p className="text-sm text-[var(--bg-muted-foreground)] pl-6">
          Receive emails about new products and features.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="security" defaultChecked />
          <Label htmlFor="security" className="cursor-pointer">
            Security updates
          </Label>
        </div>
        <p className="text-sm text-[var(--bg-muted-foreground)] pl-6">
          Receive emails about your account security.
        </p>
      </div>
    </div>
  ),
};
/**
 * With error state
 */
export const WithError = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="error-checkbox" className="border-[var(--bg-destructive)]" />
        <Label htmlFor="error-checkbox" className="cursor-pointer">
          Required checkbox
        </Label>
      </div>
      <p className="text-sm text-[var(--bg-destructive)] pl-6">
        You must accept the terms and conditions
      </p>
    </div>
  ),
};
/**
 * Indeterminate state (programmatic only)
 */
export const Indeterminate = {
  render: () => {
    const [checked, setChecked] = React.useState('indeterminate');
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="parent" checked={checked} onCheckedChange={setChecked} />
          <Label htmlFor="parent" className="cursor-pointer">
            Select all
          </Label>
        </div>
        <div className="ml-6 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="child1" />
            <Label htmlFor="child1" className="cursor-pointer">
              Child option 1
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="child2" />
            <Label htmlFor="child2" className="cursor-pointer">
              Child option 2
            </Label>
          </div>
        </div>
      </div>
    );
  },
};
//# sourceMappingURL=checkbox.stories.js.map
