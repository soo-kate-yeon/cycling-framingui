/**
 * @framingui/core - Error Screen Template
 * [SPEC-UI-002] [TAG-UI002-032] feedback.error
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

export const ErrorComponent: FC<ScreenTemplateProps> = ({ className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '오류가 발생했습니다',
    message: texts?.message ?? '요청을 처리하는 중 문제가 발생했습니다.',
    retryButton: texts?.retryButton ?? '다시 시도',
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
          className: 'max-w-md p-6 text-center',
        },
        children: [
          {
            type: 'Badge',
            props: {
              variant: 'destructive',
              className: 'mb-4',
            },
            children: ['오류'],
          },
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
            children: [defaultTexts.retryButton],
          },
        ],
      },
    ],
  } as unknown as JSX.Element;
};

export const errorTemplate: ScreenTemplate = {
  id: 'feedback.error',
  name: 'Error',
  category: 'feedback',
  description: 'Error state screen with message and retry button.',
  skeleton: {
    shell: 'shell.web.app',
    page: 'page.content',
    sections: [
      {
        id: 'message',
        name: 'Error Message',
        required: true,
        allowedComponents: ['Badge', 'Text'],
      },
      {
        id: 'actions',
        name: 'Actions',
        required: true,
        allowedComponents: ['Button'],
      },
    ],
  },
  customizable: {
    texts: ['title', 'message', 'retryButton'],
    optional: ['error_details', 'support_link'],
    slots: [],
  },
  requiredComponents: ['Button', 'Card', 'Badge'],
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
    errorColor: 'semantic.color.error',
  },
  Component: ErrorComponent,
};
