/**
 * @framingui/core - Settings/Preferences Screen Template
 * [SPEC-UI-002] [TAG-UI002-029] settings.preferences
 *
 * Design Reference: Claude.ai Settings Page
 * - 좌측 설정 메뉴 + 우측 설정 패널
 * - 섹션별 명확한 구분
 * - 토글/선택 UI 일관성
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

/**
 * Preferences Component
 * 설정/환경설정 화면 컴포넌트
 *
 * Required Components: Switch, Select, Button, Form, Tabs, Separator
 */
export const PreferencesComponent: FC<ScreenTemplateProps> = ({ slots, className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '설정',
    subtitle: texts?.subtitle ?? '앱 환경설정을 관리하세요',
    saveButton: texts?.saveButton ?? '저장',
    cancelButton: texts?.cancelButton ?? '취소',
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
          // Settings sidebar/menu
          slots?.menu ?? {
            type: 'aside',
            props: {
              className: 'w-64 border-r bg-[var(--bg-surface)]',
              style: {
                padding: 'var(--spacing-4)',
              },
            },
            children: [
              {
                type: 'Tabs',
                props: {
                  orientation: 'vertical',
                  className: 'space-y-1',
                },
                children: ['Settings menu items...'],
              },
            ],
          },

          // Settings panel
          {
            type: 'main',
            props: {
              className: 'flex-1 overflow-auto',
              style: {
                padding: 'var(--layout-padding-desktop)',
              },
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

              {
                type: 'Separator',
                props: {
                  className: 'my-6',
                },
              },

              // Settings form
              {
                type: 'Form',
                props: {
                  className: 'space-y-8 max-w-2xl',
                },
                children: [
                  // Content slot for settings sections
                  slots?.content ?? {
                    type: 'div',
                    props: {
                      className: 'space-y-6',
                    },
                    children: [
                      // Example settings group
                      {
                        type: 'div',
                        props: {
                          className: 'space-y-4',
                        },
                        children: [
                          {
                            type: 'h3',
                            props: {
                              className: 'text-lg font-medium',
                            },
                            children: ['일반 설정'],
                          },
                          {
                            type: 'div',
                            props: {
                              className: 'flex items-center justify-between',
                            },
                            children: [
                              {
                                type: 'div',
                                children: [
                                  {
                                    type: 'p',
                                    props: {
                                      className: 'font-medium',
                                    },
                                    children: ['알림'],
                                  },
                                  {
                                    type: 'p',
                                    props: {
                                      className: 'text-sm text-[var(--text-secondary)]',
                                    },
                                    children: ['푸시 알림 받기'],
                                  },
                                ],
                              },
                              {
                                type: 'Switch',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  {
                    type: 'Separator',
                    props: {
                      className: 'my-6',
                    },
                  },

                  // Action buttons
                  {
                    type: 'div',
                    props: {
                      className: 'flex gap-4',
                    },
                    children: [
                      {
                        type: 'Button',
                        props: {
                          type: 'submit',
                        },
                        children: [defaultTexts.saveButton],
                      },
                      {
                        type: 'Button',
                        props: {
                          variant: 'outline',
                        },
                        children: [defaultTexts.cancelButton],
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
 * Settings/Preferences Screen Template
 * 설정/환경설정 화면 템플릿 정의
 */
export const preferencesTemplate: ScreenTemplate = {
  id: 'settings.preferences',
  name: 'Settings/Preferences',
  category: 'form',
  description:
    'Settings and preferences screen with sidebar menu and settings panel. Organized sections with switches and selects.',

  skeleton: {
    shell: 'shell.web.app',
    page: 'page.dashboard',
    sections: [
      {
        id: 'menu',
        name: 'Settings Menu',
        required: true,
        allowedComponents: ['Tabs', 'Navigation'],
      },
      {
        id: 'header',
        name: 'Page Header',
        required: true,
        allowedComponents: ['Text'],
      },
      {
        id: 'content',
        name: 'Settings Content',
        required: true,
        allowedComponents: ['Form', 'Switch', 'Select', 'Button', 'Separator'],
      },
    ],
  },

  customizable: {
    texts: ['title', 'subtitle', 'saveButton', 'cancelButton'],
    optional: ['search', 'reset_to_defaults'],
    slots: ['menu', 'content', 'header'],
  },

  requiredComponents: ['Switch', 'Select', 'Button', 'Form', 'Tabs', 'Separator'],

  layout: {
    type: 'sidebar',
    maxWidth: 'full',
    responsive: {
      desktop: {
        padding: 'atomic.spacing.64',
        gap: 'atomic.spacing.32',
        columns: 12,
        direction: 'row',
      },
      tablet: {
        padding: 'atomic.spacing.32',
        gap: 'atomic.spacing.24',
        columns: 8,
        direction: 'column',
      },
      mobile: {
        padding: 'atomic.spacing.16',
        gap: 'atomic.spacing.16',
        columns: 4,
        direction: 'column',
      },
    },
  },

  tokenBindings: {
    backgroundColor: 'semantic.color.background.base',
    textColor: 'semantic.color.text.primary',
    sidebarBg: 'semantic.color.background.surface',
  },

  Component: PreferencesComponent,
};
