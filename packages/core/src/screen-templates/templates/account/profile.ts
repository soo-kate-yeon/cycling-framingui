/**
 * @framingui/core - Account/Profile Screen Template
 * [SPEC-UI-002] [TAG-UI002-030] account.profile
 *
 * Design Reference: Claude.ai Profile Page (Claude Web 155.png)
 * - 프로필 이미지 + 기본 정보
 * - 편집 가능한 필드 명확히 표시
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

/**
 * Profile Component
 * 프로필/내 계정 화면 컴포넌트
 *
 * Required Components: Avatar, Button, Input, Form, Card
 */
export const ProfileComponent: FC<ScreenTemplateProps> = ({ slots, className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '내 계정',
    subtitle: texts?.subtitle ?? '프로필 정보를 관리하세요',
    nameLabel: texts?.nameLabel ?? '이름',
    emailLabel: texts?.emailLabel ?? '이메일',
    saveButton: texts?.saveButton ?? '저장',
    ...texts,
  };

  return {
    type: 'div',
    props: {
      className: `min-h-screen bg-[var(--bg-base)] ${className ?? ''}`,
    },
    children: [
      {
        type: 'div',
        props: {
          className: 'flex h-screen',
        },
        children: [
          // Sidebar slot (optional)
          slots?.sidebar,

          // Main content
          {
            type: 'main',
            props: {
              className: 'flex-1 overflow-auto',
              style: {
                padding: 'var(--layout-padding-desktop)',
              },
            },
            children: [
              {
                type: 'div',
                props: {
                  className: 'max-w-2xl mx-auto',
                },
                children: [
                  // Header
                  {
                    type: 'div',
                    props: {
                      className: 'mb-8',
                    },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          className: 'text-3xl font-semibold mb-2',
                        },
                        children: [defaultTexts.title],
                      },
                      {
                        type: 'p',
                        props: {
                          className: 'text-[var(--text-secondary)]',
                        },
                        children: [defaultTexts.subtitle],
                      },
                    ],
                  },

                  // Profile card
                  {
                    type: 'Card',
                    props: {
                      className: 'p-6',
                    },
                    children: [
                      // Avatar section
                      {
                        type: 'div',
                        props: {
                          className: 'flex items-center gap-4 mb-6',
                        },
                        children: [
                          {
                            type: 'Avatar',
                            props: {
                              className: 'h-20 w-20',
                            },
                          },
                          {
                            type: 'Button',
                            props: {
                              variant: 'outline',
                              size: 'sm',
                            },
                            children: ['사진 변경'],
                          },
                        ],
                      },

                      // Profile form
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
                                type: 'label',
                                props: {
                                  className: 'text-sm font-medium',
                                },
                                children: [defaultTexts.nameLabel],
                              },
                              {
                                type: 'Input',
                                props: {
                                  type: 'text',
                                  placeholder: '홍길동',
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
                                type: 'label',
                                props: {
                                  className: 'text-sm font-medium',
                                },
                                children: [defaultTexts.emailLabel],
                              },
                              {
                                type: 'Input',
                                props: {
                                  type: 'email',
                                  placeholder: 'name@example.com',
                                },
                              },
                            ],
                          },

                          // Content slot for additional fields
                          slots?.content,

                          // Save button
                          {
                            type: 'Button',
                            props: {
                              type: 'submit',
                            },
                            children: [defaultTexts.saveButton],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  } as unknown as JSX.Element;
};

/**
 * Account/Profile Screen Template
 * 프로필/내 계정 화면 템플릿 정의
 */
export const profileTemplate: ScreenTemplate = {
  id: 'account.profile',
  name: 'Account/Profile',
  category: 'form',
  description:
    'User profile and account management screen with avatar, editable fields, and save functionality.',

  skeleton: {
    shell: 'shell.web.app',
    page: 'page.form',
    sections: [
      {
        id: 'avatar',
        name: 'Profile Avatar',
        required: true,
        allowedComponents: ['Avatar', 'Button'],
      },
      {
        id: 'form',
        name: 'Profile Form',
        required: true,
        allowedComponents: ['Input', 'Form', 'Button'],
      },
      {
        id: 'additional',
        name: 'Additional Info',
        required: false,
        allowedComponents: ['Input', 'Textarea'],
      },
    ],
  },

  customizable: {
    texts: ['title', 'subtitle', 'nameLabel', 'emailLabel', 'saveButton'],
    optional: ['profile_image_upload', 'additional_fields'],
    slots: ['sidebar', 'content'],
  },

  requiredComponents: ['Avatar', 'Button', 'Input', 'Form', 'Card'],

  layout: {
    type: 'sidebar',
    maxWidth: 'lg',
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
  },

  Component: ProfileComponent,
};
