/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SignupTemplateComponent } from './signup';
import { Checkbox } from '../../components/checkbox';
import { Label } from '../../components/label';

const meta = {
  title: 'Templates/Auth/Signup',
  component: SignupTemplateComponent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupTemplateComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default signup template
 * Accessibility: Fully accessible form with proper labels and ARIA attributes
 */
export const Default: Story = {
  args: {
    slots: {
      termsCheckbox: (
        <>
          <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm cursor-pointer">
            I agree to the{' '}
            <a href="#" className="text-[var(--text-primary)] hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[var(--text-primary)] hover:underline">
              Privacy Policy
            </a>
          </Label>
        </>
      ),
    },
  },
};
