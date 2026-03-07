/**
 * @framingui/core - Success Screen Template
 * [SPEC-UI-002] [TAG-UI002-035] feedback.success
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

export const SuccessComponent: FC<ScreenTemplateProps> = ({ className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '완료되었습니다',
    message: texts?.message ?? '작업이 성공적으로 완료되었습니다.',
    continueButton: texts?.continueButton ?? '계속',
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
              variant: 'outline',
              className: 'mb-4 bg-green-50 text-green-700 border-green-200',
            },
            children: ['✓ 성공'],
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
            children: [defaultTexts.continueButton],
          },
        ],
      },
    ],
  } as unknown as JSX.Element;
};

export const successTemplate: ScreenTemplate = {
  id: 'feedback.success',
  name: 'Success',
  category: 'feedback',
  description: 'Success state screen with positive feedback and next step button.',
  skeleton: {
    shell: 'shell.web.app',
    page: 'page.content',
    sections: [
      {
        id: 'message',
        name: 'Success Message',
        required: true,
        allowedComponents: ['Badge', 'Text'],
      },
      {
        id: 'actions',
        name: 'Next Steps',
        required: false,
        allowedComponents: ['Button'],
      },
    ],
  },
  customizable: {
    texts: ['title', 'message', 'continueButton'],
    optional: ['toast_notification', 'next_steps'],
    slots: [],
  },
  requiredComponents: ['Toast', 'Card', 'Badge'],
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
    successColor: 'semantic.color.success',
  },
  Component: SuccessComponent,
};
