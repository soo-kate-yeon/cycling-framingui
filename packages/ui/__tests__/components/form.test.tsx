/**
 * @framingui - Form Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../src/components/form';
import { Input } from '../../src/primitives/input';

/**
 * react-hook-form FormProvider 래퍼
 * Form = FormProvider이므로 useForm() 초기화 필요
 */
function TestForm({
  children,
  onSubmit,
  defaultValues = {},
  ...formProps
}: {
  children: React.ReactNode;
  onSubmit?: (data: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
  [key: string]: unknown;
}) {
  const methods = useForm({ defaultValues });
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit || (() => {}))} {...formProps}>
        {children}
      </form>
    </Form>
  );
}

describe('Form', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(
        <TestForm data-testid="form">
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      );
      expect(screen.getByTestId('form')).toBeInTheDocument();
    });

    it('renders all form sub-components', () => {
      render(
        <TestForm>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label">Email</FormLabel>
                <FormControl data-testid="control">
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage>Error message</FormMessage>
              </FormItem>
            )}
          />
        </TestForm>
      );

      expect(screen.getByTestId('label')).toBeInTheDocument();
      expect(screen.getByTestId('control')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  describe('Form Field Structure', () => {
    it('associates label with input via auto-generated id', () => {
      render(
        <TestForm>
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      );

      const label = screen.getByText('Username');
      const htmlFor = label.getAttribute('for');
      expect(htmlFor).toBeTruthy();
      const input = screen.getByRole('textbox');
      expect(input.getAttribute('id')).toBe(htmlFor);
    });

    it('renders message text', () => {
      render(
        <TestForm>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>Invalid email address</FormMessage>
              </FormItem>
            )}
          />
        </TestForm>
      );

      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('supports multiple form fields', () => {
      render(
        <TestForm>
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      );

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('handles form submit event', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(
        <TestForm onSubmit={handleSubmit} data-testid="form">
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <button type="submit">Submit</button>
        </TestForm>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <TestForm>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label">Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage data-testid="message">Message</FormMessage>
              </FormItem>
            )}
          />
        </TestForm>
      );

      // FormMessage는 tekton destructive 토큰 사용
      expect(screen.getByTestId('message')).toHaveClass('text-[var(--bg-destructive)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <TestForm>
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('auto-sets aria-describedby on form controls', () => {
      render(
        <TestForm>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>Invalid email</FormMessage>
              </FormItem>
            )}
          />
        </TestForm>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('supports custom className', () => {
      render(
        <TestForm className="custom-form" data-testid="form">
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      );
      expect(screen.getByTestId('form')).toHaveClass('custom-form');
    });
  });
});
