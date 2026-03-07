/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */
import { Input } from './input';
import { Label } from './label';
const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'],
      description: 'HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input interaction',
    },
  },
};
export default meta;
/**
 * Default text input
 */
export const Default = {
  args: {
    placeholder: 'Enter text...',
  },
};
/**
 * Email input with validation
 * Accessibility: Uses semantic type for browser validation
 */
export const Email = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};
/**
 * Password input with masked characters
 */
export const Password = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};
/**
 * Number input with numeric keyboard on mobile
 */
export const Number = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};
/**
 * Search input
 */
export const Search = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};
/**
 * Disabled state
 * Accessibility: Disabled inputs are not keyboard accessible
 */
export const Disabled = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Cannot edit',
  },
};
/**
 * With label for accessibility
 * Accessibility: Always associate inputs with labels
 */
export const WithLabel = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};
/**
 * With helper text
 */
export const WithHelperText = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-2">Email</Label>
      <Input type="email" id="email-2" placeholder="Email" />
      <p className="text-sm text-[var(--bg-muted-foreground)]">
        We'll never share your email.
      </p>
    </div>
  ),
};
/**
 * With error state
 */
export const WithError = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-3">Email</Label>
      <Input
        type="email"
        id="email-3"
        placeholder="Email"
        className="border-[var(--bg-destructive)]"
        aria-invalid="true"
        aria-describedby="email-error"
      />
      <p id="email-error" className="text-sm text-[var(--bg-destructive)]">
        Please enter a valid email address.
      </p>
    </div>
  ),
};
/**
 * File input
 */
export const File = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  ),
};
/**
 * All input types showcase
 */
export const AllTypes = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="text">Text</Label>
        <Input type="text" id="text" placeholder="Text input" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email-all">Email</Label>
        <Input type="email" id="email-all" placeholder="email@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password-all">Password</Label>
        <Input type="password" id="password-all" placeholder="Password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="number-all">Number</Label>
        <Input type="number" id="number-all" placeholder="0" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="date">Date</Label>
        <Input type="date" id="date" />
      </div>
    </div>
  ),
};
//# sourceMappingURL=input.stories.js.map
