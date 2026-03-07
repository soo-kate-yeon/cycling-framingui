/**
 * @framingui/core - Confirmation Dialog Template
 * [SPEC-UI-002] [TAG-UI002-034] feedback.confirmation
 */

/* global JSX */

import type { ScreenTemplate, ScreenTemplateProps } from '../../types.js';
import type { FC } from '../../types.js';

export const ConfirmationComponent: FC<ScreenTemplateProps> = ({ className, texts }) => {
  const defaultTexts = {
    title: texts?.title ?? '확인',
    message: texts?.message ?? '이 작업을 진행하시겠습니까?',
    confirmButton: texts?.confirmButton ?? '확인',
    cancelButton: texts?.cancelButton ?? '취소',
    ...texts,
  };

  return {
    type: 'Dialog',
    props: {
      open: true,
      className,
    },
    children: [
      {
        type: 'div',
        props: {
          className: 'p-6',
        },
        children: [
          {
            type: 'h2',
            props: {
              className: 'text-lg font-semibold mb-2',
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
            type: 'div',
            props: {
              className: 'flex gap-2 justify-end',
            },
            children: [
              {
                type: 'Button',
                props: {
                  variant: 'outline',
                },
                children: [defaultTexts.cancelButton],
              },
              {
                type: 'Button',
                children: [defaultTexts.confirmButton],
              },
            ],
          },
        ],
      },
    ],
  } as unknown as JSX.Element;
};

export const confirmationTemplate: ScreenTemplate = {
  id: 'feedback.confirmation',
  name: 'Confirmation',
  category: 'feedback',
  description: 'Confirmation dialog with yes/no buttons.',
  skeleton: {
    shell: 'shell.web.app',
    page: 'page.content',
    sections: [
      {
        id: 'message',
        name: 'Confirmation Message',
        required: true,
        allowedComponents: ['Text'],
      },
      {
        id: 'actions',
        name: 'Action Buttons',
        required: true,
        allowedComponents: ['Button'],
      },
    ],
  },
  customizable: {
    texts: ['title', 'message', 'confirmButton', 'cancelButton'],
    optional: ['warning_icon'],
    slots: [],
  },
  requiredComponents: ['Dialog', 'Button', 'AlertDialog'],
  layout: {
    type: 'centered',
    maxWidth: 'sm',
    responsive: {
      desktop: { padding: 'atomic.spacing.32', gap: 'atomic.spacing.16', direction: 'column' },
      tablet: { padding: 'atomic.spacing.24', gap: 'atomic.spacing.16', direction: 'column' },
      mobile: { padding: 'atomic.spacing.16', gap: 'atomic.spacing.12', direction: 'column' },
    },
  },
  tokenBindings: {
    backgroundColor: 'semantic.color.background.surface',
  },
  Component: ConfirmationComponent,
};
