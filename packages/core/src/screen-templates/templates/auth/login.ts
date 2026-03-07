/**
 * @framingui/core - Login Screen Template
 * [SPEC-UI-002] [TAG-UI002-024] auth.login
 *
 * Design Reference: Claude.ai Login Page
 * - 중앙 정렬 카드 레이아웃
 * - 명료함과 접근성 우선
 * - 절제된 색상 사용
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

/**
 * Login Component
 * 로그인 화면 컴포넌트
 *
 * Required Components: Button, Input, Form, Card, Label
 */
export const LoginComponent: FC<ScreenTemplateProps> = ({ slots, className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '로그인',
    subtitle: texts?.subtitle ?? '계정에 로그인하세요',
    emailLabel: texts?.emailLabel ?? '이메일',
    passwordLabel: texts?.passwordLabel ?? '비밀번호',
    loginButton: texts?.loginButton ?? '로그인',
    forgotPassword: texts?.forgotPassword ?? '비밀번호를 잊으셨나요?',
    signupLink: texts?.signupLink ?? '회원가입',
    ...texts,
  };

  return {
    type: 'div',
    props: {
      className: `min-h-screen flex items-center justify-center bg-[var(--bg-base)] ${className ?? ''}`,
      style: {
        padding: 'var(--layout-padding-mobile)',
      },
    },
    children: [
      {
        type: 'Card',
        props: {
          className: 'w-full max-w-md',
          style: {
            padding: 'var(--spacing-8)',
            gap: 'var(--spacing-6)',
          },
        },
        children: [
          // Header slot
          slots?.header ?? null,

          // Title section
          {
            type: 'div',
            props: {
              className: 'space-y-2 text-center',
            },
            children: [
              {
                type: 'h1',
                props: {
                  className: 'text-2xl font-semibold',
                },
                children: [defaultTexts.title],
              },
              {
                type: 'p',
                props: {
                  className: 'text-sm text-[var(--text-secondary)]',
                },
                children: [defaultTexts.subtitle],
              },
            ],
          },

          // Form
          {
            type: 'Form',
            props: {
              className: 'space-y-4',
            },
            children: [
              // Email field
              {
                type: 'div',
                props: {
                  className: 'space-y-2',
                },
                children: [
                  {
                    type: 'Label',
                    props: {
                      htmlFor: 'email',
                    },
                    children: [defaultTexts.emailLabel],
                  },
                  {
                    type: 'Input',
                    props: {
                      id: 'email',
                      type: 'email',
                      placeholder: 'name@example.com',
                      required: true,
                    },
                  },
                ],
              },

              // Password field
              {
                type: 'div',
                props: {
                  className: 'space-y-2',
                },
                children: [
                  {
                    type: 'Label',
                    props: {
                      htmlFor: 'password',
                    },
                    children: [defaultTexts.passwordLabel],
                  },
                  {
                    type: 'Input',
                    props: {
                      id: 'password',
                      type: 'password',
                      required: true,
                    },
                  },
                ],
              },

              // Login button
              {
                type: 'Button',
                props: {
                  type: 'submit',
                  className: 'w-full',
                },
                children: [defaultTexts.loginButton],
              },
            ],
          },

          // Footer links
          {
            type: 'div',
            props: {
              className: 'flex flex-col items-center gap-2 text-sm',
            },
            children: [
              {
                type: 'a',
                props: {
                  href: '/forgot-password',
                  className: 'text-[var(--text-link)] hover:underline',
                },
                children: [defaultTexts.forgotPassword],
              },
              {
                type: 'div',
                props: {
                  className: 'text-[var(--text-secondary)]',
                },
                children: [
                  '계정이 없으신가요? ',
                  {
                    type: 'a',
                    props: {
                      href: '/signup',
                      className: 'text-[var(--text-link)] hover:underline',
                    },
                    children: [defaultTexts.signupLink],
                  },
                ],
              },
            ],
          },

          // Footer slot
          slots?.footer ?? null,
        ],
      },
    ],
  } as unknown as JSX.Element;
};

/**
 * Login Screen Template
 * 로그인 화면 템플릿 정의
 */
export const loginTemplate: ScreenTemplate = {
  id: 'auth.login',
  name: 'Login',
  category: 'auth',
  description:
    'User login screen with email/password authentication. Clean, centered layout following Claude.ai design principles.',

  skeleton: {
    shell: 'shell.web.app',
    page: 'page.auth',
    sections: [
      {
        id: 'logo',
        name: 'Logo',
        required: false,
        allowedComponents: ['Logo', 'Image'],
      },
      {
        id: 'form',
        name: 'Login Form',
        required: true,
        allowedComponents: ['Form', 'Input', 'Button', 'Label'],
      },
      {
        id: 'footer',
        name: 'Footer Links',
        required: false,
        allowedComponents: ['Link', 'Text'],
      },
    ],
  },

  customizable: {
    texts: [
      'title',
      'subtitle',
      'emailLabel',
      'passwordLabel',
      'loginButton',
      'forgotPassword',
      'signupLink',
    ],
    optional: ['social_login', 'remember_me', 'logo'],
    slots: ['header', 'footer'],
  },

  requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label'],

  layout: {
    type: 'centered',
    maxWidth: 'sm',
    responsive: {
      desktop: {
        padding: 'atomic.spacing.64',
        gap: 'atomic.spacing.32',
        direction: 'column',
      },
      tablet: {
        padding: 'atomic.spacing.32',
        gap: 'atomic.spacing.24',
        direction: 'column',
      },
      mobile: {
        padding: 'atomic.spacing.16',
        gap: 'atomic.spacing.16',
        direction: 'column',
      },
    },
  },

  tokenBindings: {
    backgroundColor: 'semantic.color.background.base',
    textColor: 'semantic.color.text.primary',
    linkColor: 'semantic.color.text.link',
  },

  Component: LoginComponent,
};
