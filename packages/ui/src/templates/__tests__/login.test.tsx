/**
 * @framingui/ui - Login Template Tests
 * SPEC-UI-001 Phase 3: Login Template Unit Tests
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoginTemplate, LoginTemplateComponent } from '../auth/login';
import { Button } from '../../components/button';

describe('LoginTemplate', () => {
  describe('Template Definition', () => {
    it('has correct metadata', () => {
      expect(LoginTemplate.id).toBe('auth.login');
      expect(LoginTemplate.name).toBe('Login');
      expect(LoginTemplate.category).toBe('auth');
    });

    it('has correct layout type', () => {
      expect(LoginTemplate.layout.type).toBe('centered');
    });

    it('specifies required components', () => {
      expect(LoginTemplate.requiredComponents).toContain('Button');
      expect(LoginTemplate.requiredComponents).toContain('Input');
      expect(LoginTemplate.requiredComponents).toContain('Card');
      expect(LoginTemplate.requiredComponents).toContain('Label');
    });

    it('defines customizable texts', () => {
      expect(LoginTemplate.customizable.texts).toContain('title');
      expect(LoginTemplate.customizable.texts).toContain('subtitle');
      expect(LoginTemplate.customizable.texts).toContain('button_label');
    });

    it('defines optional features', () => {
      expect(LoginTemplate.customizable.optional).toContain('social_login');
      expect(LoginTemplate.customizable.optional).toContain('remember_me');
    });

    it('defines customizable slots', () => {
      expect(LoginTemplate.customizable.slots).toContain('logo');
      expect(LoginTemplate.customizable.slots).toContain('forgotPassword');
      expect(LoginTemplate.customizable.slots).toContain('socialLogin');
      expect(LoginTemplate.customizable.slots).toContain('footer');
    });
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<LoginTemplateComponent />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default texts', () => {
      render(<LoginTemplateComponent />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('renders with custom texts', () => {
      render(
        <LoginTemplateComponent
          texts={{
            title: 'Custom Title',
            subtitle: 'Custom Subtitle',
            button_label: 'Log In',
          }}
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    });

    it('renders email and password inputs', () => {
      render(<LoginTemplateComponent />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders logo slot', () => {
      render(<LoginTemplateComponent slots={{ logo: <div>Logo</div> }} />);
      expect(screen.getByText('Logo')).toBeInTheDocument();
    });

    it('renders forgot password slot', () => {
      render(<LoginTemplateComponent slots={{ forgotPassword: <a href="#">Forgot?</a> }} />);
      expect(screen.getByText('Forgot?')).toBeInTheDocument();
    });

    it('shows social login when enabled', () => {
      render(
        <LoginTemplateComponent
          options={{ social_login: true }}
          slots={{
            socialLogin: (
              <>
                <Button variant="outline">Google</Button>
                <Button variant="outline">GitHub</Button>
              </>
            ),
          }}
        />
      );

      expect(screen.getByText('Or continue with')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'GitHub' })).toBeInTheDocument();
    });

    it('hides social login when disabled', () => {
      render(<LoginTemplateComponent options={{ social_login: false }} />);
      expect(screen.queryByText('Or continue with')).not.toBeInTheDocument();
    });

    it('shows remember me when enabled', () => {
      render(
        <LoginTemplateComponent
          options={{ remember_me: true }}
          slots={{
            rememberMe: (
              <label>
                <input type="checkbox" /> Remember me
              </label>
            ),
          }}
        />
      );

      expect(screen.getByText('Remember me')).toBeInTheDocument();
    });

    it('renders custom footer', () => {
      render(<LoginTemplateComponent slots={{ footer: <div>Custom Footer</div> }} />);
      expect(screen.getByText('Custom Footer')).toBeInTheDocument();
    });

    it('renders default footer when not provided', () => {
      render(<LoginTemplateComponent />);
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });
  });

  describe('Token Usage', () => {
    it('uses Tekton spacing tokens', () => {
      const { container } = render(<LoginTemplateComponent />);
      const html = container.innerHTML;
      expect(html).toMatch(/var\(--spacing-/);
    });

    it('uses Tekton text color tokens', () => {
      const { container } = render(<LoginTemplateComponent />);
      const html = container.innerHTML;
      expect(html).toMatch(/var\(--text-/);
    });
  });
});
