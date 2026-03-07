/**
 * @framingui/core - Empty State Screen Template
 * [SPEC-UI-002] [TAG-UI002-033] feedback.empty
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

export const EmptyComponent: FC<ScreenTemplateProps> = ({ className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '아직 아무것도 없습니다',
    message: texts?.message ?? '지금 바로 시작해보세요.',
    ctaButton: texts?.ctaButton ?? '시작하기',
    ...texts,
  };

  return {
    type: 'div',
    props: {
      className: `min-h-screen flex items-center justify-center bg-[var(--bg-base)] ${className ?? ''}`,
    },
    children: [
      {
        type: 'Card',
        props: {
          className: 'max-w-md p-8 text-center',
        },
        children: [
          {
            type: 'h2',
            props: {
              className: 'text-xl font-semibold mb-2',
            },
            children: [defaultTexts.title],
          },
          {
            type: 'p',
            props: {
              className: 'text-sm text-[var(--text-secondary)] mb-4',
            },
            children: [defaultTexts.message],
          },
          {
            type: 'Button',
            children: [defaultTexts.ctaButton],
          },
        ],
      },
    ],
  } as unknown as JSX.Element;
};

export const emptyTemplate: ScreenTemplate = {
  id: 'feedback.empty',
  name: 'Empty State',
  category: 'feedback',
  description: 'Empty state screen with friendly message and CTA button.',
  skeleton: {
    shell: 'shell.web.app',
    page: 'page.content',
    sections: [
      {
        id: 'message',
        name: 'Empty Message',
        required: true,
        allowedComponents: ['Text'],
      },
      {
        id: 'cta',
        name: 'Call to Action',
        required: true,
        allowedComponents: ['Button'],
      },
    ],
  },
  customizable: {
    texts: ['title', 'message', 'ctaButton'],
    optional: ['illustration', 'help_link'],
    slots: [],
  },
  requiredComponents: ['Button', 'Card'],
  layout: {
    type: 'centered',
    maxWidth: 'md',
    responsive: {
      desktop: { padding: 'atomic.spacing.64', gap: 'atomic.spacing.32', direction: 'column' },
      tablet: { padding: 'atomic.spacing.32', gap: 'atomic.spacing.24', direction: 'column' },
      mobile: { padding: 'atomic.spacing.16', gap: 'atomic.spacing.16', direction: 'column' },
    },
  },
  tokenBindings: {
    backgroundColor: 'semantic.color.background.base',
  },
  Component: EmptyComponent,
};
