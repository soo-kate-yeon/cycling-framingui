/**
 * @framingui/core - Forgot Password Screen Template
 * [SPEC-UI-002] [TAG-UI002-026] auth.forgot-password
 *
 * Design Reference: Claude.ai / Reference Image (Lovable Web 335.png)
 * - 간결한 설명 + 이메일 입력
 * - 안내 메시지는 명확하고 친절하게
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

/**
 * ForgotPassword Component
 * 비밀번호 찾기 화면 컴포넌트
 *
 * Required Components: Button, Input, Form, Card, Label
 */
export const ForgotPasswordComponent: FC<ScreenTemplateProps> = ({ slots, className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '비밀번호 재설정',
    subtitle:
      texts?.subtitle ??
      '가입하신 이메일 주소를 입력해주세요. 비밀번호 재설정 링크를 보내드립니다.',
    emailLabel: texts?.emailLabel ?? '이메일',
    sendButton: texts?.sendButton ?? '재설정 링크 보내기',
    backToLogin: texts?.backToLogin ?? '로그인으로 돌아가기',
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

              // Send button
              {
                type: 'Button',
                props: {
                  type: 'submit',
                  className: 'w-full',
                },
                children: [defaultTexts.sendButton],
              },
            ],
          },

          // Back to login link
          {
            type: 'div',
            props: {
              className: 'text-center',
            },
            children: [
              {
                type: 'a',
                props: {
                  href: '/login',
                  className: 'text-sm text-[var(--text-link)] hover:underline',
                },
                children: [defaultTexts.backToLogin],
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
 * Forgot Password Screen Template
 * 비밀번호 찾기 화면 템플릿 정의
 */
export const forgotPasswordTemplate: ScreenTemplate = {
  id: 'auth.forgot-password',
  name: 'Forgot Password',
  category: 'auth',
  description:
    'Password reset screen with email input. Simple and clear instructions for users to reset their password.',

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
        name: 'Reset Form',
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
    texts: ['title', 'subtitle', 'emailLabel', 'sendButton', 'backToLogin'],
    optional: ['logo', 'help_text'],
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

  Component: ForgotPasswordComponent,
};
