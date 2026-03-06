/**
 * @framingui/core - Email Verification Screen Template
 * [SPEC-UI-002] [TAG-UI002-027] auth.verification
 *
 * Design Reference: Claude.ai Email Verification
 * - 중앙 정렬 메시지
 * - 명확한 다음 단계 안내
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

/**
 * Verification Component
 * 이메일 인증 화면 컴포넌트
 *
 * Required Components: Button, Card, Badge
 */
export const VerificationComponent: FC<ScreenTemplateProps> = ({ slots, className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '이메일 인증',
    subtitle: texts?.subtitle ?? '이메일로 인증 링크를 보내드렸습니다',
    instruction: texts?.instruction ?? '받은 편지함을 확인하고 인증 링크를 클릭해주세요',
    email: texts?.email ?? '',
    resendButton: texts?.resendButton ?? '인증 메일 재전송',
    continueButton: texts?.continueButton ?? '계속하기',
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

          // Icon/Badge (success indicator)
          {
            type: 'div',
            props: {
              className: 'flex justify-center',
            },
            children: [
              {
                type: 'Badge',
                props: {
                  variant: 'outline',
                  className: 'px-4 py-2',
                },
                children: ['✓ 전송 완료'],
              },
            ],
          },

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

          // Email display (if provided)
          defaultTexts.email
            ? {
                type: 'div',
                props: {
                  className: 'text-center',
                },
                children: [
                  {
                    type: 'Badge',
                    props: {
                      variant: 'secondary',
                    },
                    children: [defaultTexts.email],
                  },
                ],
              }
            : null,

          // Instructions
          {
            type: 'p',
            props: {
              className: 'text-sm text-center text-[var(--text-secondary)]',
            },
            children: [defaultTexts.instruction],
          },

          // Action buttons
          {
            type: 'div',
            props: {
              className: 'space-y-3',
            },
            children: [
              // Continue button
              {
                type: 'Button',
                props: {
                  className: 'w-full',
                },
                children: [defaultTexts.continueButton],
              },

              // Resend button
              {
                type: 'Button',
                props: {
                  variant: 'outline',
                  className: 'w-full',
                },
                children: [defaultTexts.resendButton],
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
 * Email Verification Screen Template
 * 이메일 인증 화면 템플릿 정의
 */
export const verificationTemplate: ScreenTemplate = {
  id: 'auth.verification',
  name: 'Email Verification',
  category: 'auth',
  description:
    'Email verification screen with status message and action buttons. Clear next steps for users after signup.',

  skeleton: {
    shell: 'shell.web.app',
    page: 'page.auth',
    sections: [
      {
        id: 'status',
        name: 'Status Message',
        required: true,
        allowedComponents: ['Badge', 'Text'],
      },
      {
        id: 'actions',
        name: 'Action Buttons',
        required: true,
        allowedComponents: ['Button'],
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
      'instruction',
      'email',
      'resendButton',
      'continueButton',
      'backToLogin',
    ],
    optional: ['email_display', 'resend_timer'],
    slots: ['header', 'footer'],
  },

  requiredComponents: ['Button', 'Card', 'Badge'],

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
    successColor: 'semantic.color.success',
  },

  Component: VerificationComponent,
};
