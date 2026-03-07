/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */
import { Label } from './label';
import { Input } from './input';
import { Checkbox } from './checkbox';
const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;
/**
 * Default label
 * Accessibility: Labels provide accessible names for form controls
 */
export const Default = {
  render: () => <Label>Label</Label>,
};
/**
 * Label with input
 * Accessibility: Proper htmlFor association enables click-to-focus
 */
export const WithInput = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email address</Label>
      <Input type="email" id="email" placeholder="email@example.com" />
    </div>
  ),
};
/**
 * Required field indicator
 */
export const Required = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="username">
        Username <span className="text-[var(--bg-destructive)]">*</span>
      </Label>
      <Input id="username" placeholder="Enter username" required />
    </div>
  ),
};
/**
 * Label with checkbox
 */
export const WithCheckbox = {
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
 * Disabled state
 * Accessibility: Disabled labels indicate non-interactive controls
 */
export const Disabled = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="disabled" className="opacity-70">
        Disabled field
      </Label>
      <Input id="disabled" placeholder="Cannot edit" disabled />
    </div>
  ),
};
/**
 * Form example with multiple labels
 */
export const FormExample = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="firstname">First name</Label>
        <Input id="firstname" placeholder="John" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lastname">Last name</Label>
        <Input id="lastname" placeholder="Doe" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email-form">
          Email <span className="text-[var(--bg-destructive)]">*</span>
        </Label>
        <Input id="email-form" type="email" placeholder="john@example.com" required />
      </div>
    </div>
  ),
};
//# sourceMappingURL=label.stories.js.map
