/**
 * @framingui/core - Loading Screen Template
 * [SPEC-UI-002] [TAG-UI002-031] feedback.loading
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

export const LoadingComponent: FC<ScreenTemplateProps> = ({ className, texts }) => {
  const defaultTexts = {
    message: texts?.message ?? '잠시만 기다려주세요...',
    ...texts,
  };

  return {
    type: 'div',
    props: {
      className: `min-h-screen flex items-center justify-center bg-[var(--bg-base)] ${className ?? ''}`,
    },
    children: [
      {
        type: 'div',
        props: {
          className: 'text-center space-y-4',
        },
        children: [
          {
            type: 'Skeleton',
            props: {
              className: 'h-12 w-12 rounded-full mx-auto',
            },
          },
          {
            type: 'p',
            props: {
              className: 'text-sm text-[var(--text-secondary)]',
            },
            children: [defaultTexts.message],
          },
        ],
      },
    ],
  } as unknown as JSX.Element;
};

export const loadingTemplate: ScreenTemplate = {
  id: 'feedback.loading',
  name: 'Loading',
  category: 'feedback',
  description: 'Loading state screen with skeleton and optional message.',
  skeleton: {
    shell: 'shell.web.app',
    page: 'page.content',
    sections: [
      {
        id: 'indicator',
        name: 'Loading Indicator',
        required: true,
        allowedComponents: ['Skeleton', 'Spinner'],
      },
    ],
  },
  customizable: {
    texts: ['message'],
    optional: ['progress_bar'],
    slots: [],
  },
  requiredComponents: ['Skeleton', 'Card'],
  layout: {
    type: 'centered',
    maxWidth: 'sm',
    responsive: {
      desktop: { padding: 'atomic.spacing.64', gap: 'atomic.spacing.32', direction: 'column' },
      tablet: { padding: 'atomic.spacing.32', gap: 'atomic.spacing.24', direction: 'column' },
      mobile: { padding: 'atomic.spacing.16', gap: 'atomic.spacing.16', direction: 'column' },
    },
  },
  tokenBindings: {
    backgroundColor: 'semantic.color.background.base',
  },
  Component: LoadingComponent,
};
