/**
 * @framingui/core - Landing/Home Screen Template
 * [SPEC-UI-002] [TAG-UI002-028] home.landing
 *
 * Design Reference: Claude.ai Main Dashboard
 * - 좌측 사이드바 + 메인 컨텐츠 영역
 * - 최근 활동/추천 항목 표시
 * - 명확한 CTA
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

/**
 * Landing Component
 * 홈/랜딩 화면 컴포넌트
 *
 * Required Components: Button, Card, Avatar, Badge
 */
export const LandingComponent: FC<ScreenTemplateProps> = ({ slots, className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '홈',
    subtitle: texts?.subtitle ?? '최근 활동',
    ctaButton: texts?.ctaButton ?? '새로 시작하기',
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
          // Sidebar slot
          slots?.sidebar ?? {
            type: 'aside',
            props: {
              className: 'w-64 border-r bg-[var(--bg-surface)]',
              style: {
                padding: 'var(--spacing-4)',
              },
            },
            children: [
              {
                type: 'nav',
                props: {
                  className: 'space-y-2',
                },
                children: ['Navigation items...'],
              },
            ],
          },

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

              // CTA Section
              {
                type: 'div',
                props: {
                  className: 'mb-8',
                },
                children: [
                  {
                    type: 'Button',
                    props: {
                      size: 'lg',
                    },
                    children: [defaultTexts.ctaButton],
                  },
                ],
              },

              // Content slot (recent activities, recommendations, etc.)
              slots?.content ?? {
                type: 'div',
                props: {
                  className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
                },
                children: [
                  // Placeholder cards
                  {
                    type: 'Card',
                    props: {
                      className: 'p-6',
                    },
                    children: ['Recent activity card...'],
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
 * Landing/Home Screen Template
 * 홈/랜딩 화면 템플릿 정의
 */
export const landingTemplate: ScreenTemplate = {
  id: 'home.landing',
  name: 'Home/Landing',
  category: 'content',
  description:
    'Main landing/home screen with sidebar navigation and content area. Displays recent activities and primary CTA.',

  skeleton: {
    shell: 'shell.web.app',
    page: 'page.dashboard',
    sections: [
      {
        id: 'sidebar',
        name: 'Sidebar Navigation',
        required: true,
        allowedComponents: ['Navigation', 'Logo', 'Avatar'],
      },
      {
        id: 'header',
        name: 'Page Header',
        required: true,
        allowedComponents: ['Text', 'Button'],
      },
      {
        id: 'content',
        name: 'Main Content',
        required: true,
        allowedComponents: ['Card', 'Button', 'Badge', 'Avatar'],
      },
    ],
  },

  customizable: {
    texts: ['title', 'subtitle', 'ctaButton'],
    optional: ['recent_activities', 'recommendations', 'user_avatar'],
    slots: ['sidebar', 'content', 'header'],
  },

  requiredComponents: ['Button', 'Card', 'Avatar', 'Badge'],

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

  Component: LandingComponent,
};
