/**
 * @framingui/core - Signup Screen Template
 * [SPEC-UI-002] [TAG-UI002-025] auth.signup
 *
 * Design Reference: Claude.ai Signup Page
 * - auth.login과 동일한 레이아웃 구조
 * - 추가 입력 필드 (이름, 비밀번호 확인)
 * - 약관 동의 체크박스
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

/**
 * Signup Component
 * 회원가입 화면 컴포넌트
 *
 * Required Components: Button, Input, Form, Card, Label, Checkbox
 */
export const SignupComponent: FC<ScreenTemplateProps> = ({ slots, className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '회원가입',
    subtitle: texts?.subtitle ?? '새 계정을 만드세요',
    nameLabel: texts?.nameLabel ?? '이름',
    emailLabel: texts?.emailLabel ?? '이메일',
    passwordLabel: texts?.passwordLabel ?? '비밀번호',
    confirmPasswordLabel: texts?.confirmPasswordLabel ?? '비밀번호 확인',
    termsLabel: texts?.termsLabel ?? '이용약관 및 개인정보처리방침에 동의합니다',
    signupButton: texts?.signupButton ?? '가입하기',
    loginLink: texts?.loginLink ?? '로그인',
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
              // Name field
              {
                type: 'div',
                props: {
                  className: 'space-y-2',
                },
                children: [
                  {
                    type: 'Label',
                    props: {
                      htmlFor: 'name',
                    },
                    children: [defaultTexts.nameLabel],
                  },
                  {
                    type: 'Input',
                    props: {
                      id: 'name',
                      type: 'text',
                      placeholder: '홍길동',
                      required: true,
                    },
                  },
                ],
              },

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

              // Confirm password field
              {
                type: 'div',
                props: {
                  className: 'space-y-2',
                },
                children: [
                  {
                    type: 'Label',
                    props: {
                      htmlFor: 'confirm-password',
                    },
                    children: [defaultTexts.confirmPasswordLabel],
                  },
                  {
                    type: 'Input',
                    props: {
                      id: 'confirm-password',
                      type: 'password',
                      required: true,
                    },
                  },
                ],
              },

              // Terms checkbox
              {
                type: 'div',
                props: {
                  className: 'flex items-center gap-2',
                },
                children: [
                  {
                    type: 'Checkbox',
                    props: {
                      id: 'terms',
                      required: true,
                    },
                  },
                  {
                    type: 'Label',
                    props: {
                      htmlFor: 'terms',
                      className: 'text-sm font-normal',
                    },
                    children: [defaultTexts.termsLabel],
                  },
                ],
              },

              // Signup button
              {
                type: 'Button',
                props: {
                  type: 'submit',
                  className: 'w-full',
                },
                children: [defaultTexts.signupButton],
              },
            ],
          },

          // Footer link
          {
            type: 'div',
            props: {
              className: 'text-center text-sm text-[var(--text-secondary)]',
            },
            children: [
              '이미 계정이 있으신가요? ',
              {
                type: 'a',
                props: {
                  href: '/login',
                  className: 'text-[var(--text-link)] hover:underline',
                },
                children: [defaultTexts.loginLink],
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
 * Signup Screen Template
 * 회원가입 화면 템플릿 정의
 */
export const signupTemplate: ScreenTemplate = {
  id: 'auth.signup',
  name: 'Signup',
  category: 'auth',
  description:
    'User signup screen with name, email, password, and terms agreement. Follows auth.login layout structure with additional fields.',

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
        name: 'Signup Form',
        required: true,
        allowedComponents: ['Form', 'Input', 'Button', 'Label', 'Checkbox'],
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
      'nameLabel',
      'emailLabel',
      'passwordLabel',
      'confirmPasswordLabel',
      'termsLabel',
      'signupButton',
      'loginLink',
    ],
    optional: ['social_signup', 'logo'],
    slots: ['header', 'footer'],
  },

  requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label', 'Checkbox'],

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

  Component: SignupComponent,
};
