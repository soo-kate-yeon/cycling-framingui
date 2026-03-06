import type {
  ScreenTemplateDefinition,
  TemplateCategory,
  TemplateResponsiveLayout,
} from './types.js';

export type {
  ScreenTemplateDefinition,
  TemplateCategory,
  TemplateLayoutType,
  TemplateResponsiveBreakpoint,
  TemplateResponsiveLayout,
  TemplateSectionDefinition,
  TemplateLayoutDefinition,
  TemplateCustomizableDefinition,
} from './types.js';

const DEFAULT_RESPONSIVE_LAYOUT: TemplateResponsiveLayout = {
  mobile: {
    padding: 'var(--tekton-layout-padding-mobile)',
    gap: 'var(--tekton-layout-gap-mobile)',
    columns: 4,
  },
  tablet: {
    padding: 'var(--tekton-layout-padding-tablet)',
    gap: 'var(--tekton-layout-gap-tablet)',
    columns: 8,
  },
  desktop: {
    padding: 'var(--tekton-layout-padding-desktop)',
    gap: 'var(--tekton-layout-gap-desktop)',
    columns: 12,
  },
};

const centeredLayout = {
  type: 'centered',
  responsive: DEFAULT_RESPONSIVE_LAYOUT,
} as const;

const sidebarLayout = {
  type: 'sidebar',
  responsive: DEFAULT_RESPONSIVE_LAYOUT,
} as const;

export const SCREEN_TEMPLATE_DEFINITIONS: ScreenTemplateDefinition[] = [
  {
    id: 'auth.login',
    name: 'Login',
    category: 'auth',
    description: 'Standard login screen with email and password',
    skeleton: {
      shell: 'centered-card',
      page: 'auth-page',
      sections: [{ id: 'login-form', name: 'Login Form', slot: 'main', required: true }],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'subtitle', 'button_label'],
      optional: ['social_login', 'remember_me'],
      slots: ['logo', 'forgotPassword', 'rememberMe', 'socialLogin', 'footer'],
    },
    requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label'],
    version: '1.0.0',
    created: '2026-01-31',
    updated: '2026-01-31',
    tags: ['auth', 'login', 'form'],
  },
  {
    id: 'auth.signup',
    name: 'Signup',
    category: 'auth',
    description: 'Standard signup screen with name, email, and password',
    skeleton: {
      shell: 'centered-card',
      page: 'auth-page',
      sections: [{ id: 'signup-form', name: 'Signup Form', slot: 'main', required: true }],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'subtitle', 'button_label'],
      optional: ['social_signup'],
      slots: ['logo', 'termsCheckbox', 'socialSignup', 'footer'],
    },
    requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label', 'Checkbox'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['auth', 'signup', 'registration', 'form'],
  },
  {
    id: 'auth.forgot-password',
    name: 'Forgot Password',
    category: 'auth',
    description: 'Password reset screen with email input',
    skeleton: {
      shell: 'centered-card',
      page: 'auth-page',
      sections: [
        {
          id: 'forgot-password-form',
          name: 'Forgot Password Form',
          slot: 'main',
          required: true,
        },
      ],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'subtitle', 'button_label'],
      optional: [],
      slots: ['logo', 'footer'],
    },
    requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['auth', 'password', 'reset', 'forgot'],
  },
  {
    id: 'auth.verification',
    name: 'Email Verification',
    category: 'auth',
    description: 'Email verification screen with resend option',
    skeleton: {
      shell: 'centered-card',
      page: 'auth-page',
      sections: [
        {
          id: 'verification-message',
          name: 'Verification Message',
          slot: 'main',
          required: true,
        },
      ],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'subtitle', 'button_label'],
      optional: ['show_resend', 'user_email'],
      slots: ['icon', 'footer'],
    },
    requiredComponents: ['Button', 'Card'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['auth', 'verification', 'email', 'confirm'],
  },
  {
    id: 'dashboard.overview',
    name: 'Dashboard Overview',
    category: 'dashboard',
    description:
      'Standard dashboard layout with sidebar, metrics, and content areas (12-column grid)',
    skeleton: {
      shell: 'sidebar-layout',
      page: 'dashboard-page',
      sections: [
        {
          id: 'dashboard-sidebar',
          name: 'Sidebar Navigation',
          slot: 'sidebar',
          required: false,
        },
        {
          id: 'dashboard-main',
          name: 'Main Content',
          slot: 'primaryContent',
          required: true,
        },
        {
          id: 'dashboard-side',
          name: 'Side Panel',
          slot: 'secondaryContent',
          required: false,
        },
      ],
    },
    layout: sidebarLayout,
    customizable: {
      texts: ['title', 'subtitle', 'texts.secondary_title', 'texts.secondary_description'],
      optional: ['metrics', 'additionalSections'],
      slots: [
        'sidebar',
        'headerActions',
        'metrics',
        'primaryContent',
        'secondaryContent',
        'additionalSections',
      ],
    },
    requiredComponents: ['Card', 'Separator'],
    version: '1.1.0',
    created: '2026-01-31',
    updated: '2026-02-01',
    tags: ['dashboard', 'overview', 'analytics'],
  },
  {
    id: 'core.landing',
    name: 'Landing',
    category: 'marketing',
    description: 'Main dashboard landing page with sidebar and CTA',
    skeleton: {
      shell: 'sidebar-layout',
      page: 'main-page',
      sections: [{ id: 'landing-content', name: 'Landing Content', slot: 'main', required: true }],
    },
    layout: sidebarLayout,
    customizable: {
      texts: ['title', 'subtitle', 'cta_label'],
      optional: [],
      slots: ['sidebar', 'header', 'recentActivity', 'suggestions'],
    },
    requiredComponents: ['Button'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['core', 'landing', 'dashboard', 'home'],
  },
  {
    id: 'core.preferences',
    name: 'Preferences',
    category: 'form',
    description: 'Settings and preferences page with categorized options',
    skeleton: {
      shell: 'sidebar-layout',
      page: 'settings-page',
      sections: [
        {
          id: 'preferences-content',
          name: 'Preferences Content',
          slot: 'main',
          required: true,
        },
      ],
    },
    layout: sidebarLayout,
    customizable: {
      texts: ['title', 'subtitle', 'save_label'],
      optional: [],
      slots: [
        'settingsNav',
        'generalSettings',
        'appearanceSettings',
        'notificationsSettings',
        'additionalSettings',
      ],
    },
    requiredComponents: ['Button', 'Card', 'Switch', 'Select'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['core', 'settings', 'preferences', 'configuration'],
  },
  {
    id: 'core.profile',
    name: 'Profile',
    category: 'form',
    description: 'User profile page with editable information',
    skeleton: {
      shell: 'centered-layout',
      page: 'profile-page',
      sections: [{ id: 'profile-content', name: 'Profile Content', slot: 'main', required: true }],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'subtitle', 'save_label'],
      optional: ['user_name', 'user_email'],
      slots: ['avatar', 'bioField', 'additionalFields', 'additionalSections'],
    },
    requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label', 'Avatar'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['core', 'profile', 'account', 'user'],
  },
  {
    id: 'feedback.loading',
    name: 'Loading',
    category: 'feedback',
    description: 'Loading state screen with spinner and optional message',
    skeleton: {
      shell: 'centered',
      page: 'feedback-page',
      sections: [
        {
          id: 'loading-indicator',
          name: 'Loading Indicator',
          slot: 'main',
          required: true,
        },
      ],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['message'],
      optional: ['show_message'],
      slots: ['spinner'],
    },
    requiredComponents: [],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['feedback', 'loading', 'spinner', 'state'],
  },
  {
    id: 'feedback.error',
    name: 'Error',
    category: 'feedback',
    description: 'Error state screen with message and retry option',
    skeleton: {
      shell: 'centered',
      page: 'feedback-page',
      sections: [{ id: 'error-message', name: 'Error Message', slot: 'main', required: true }],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'message', 'retry_label'],
      optional: ['show_retry'],
      slots: ['icon', 'errorDetails', 'additionalActions'],
    },
    requiredComponents: ['Button'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['feedback', 'error', 'failure', 'state'],
  },
  {
    id: 'feedback.empty',
    name: 'Empty',
    category: 'feedback',
    description: 'Empty state screen with call-to-action',
    skeleton: {
      shell: 'centered',
      page: 'feedback-page',
      sections: [{ id: 'empty-state', name: 'Empty State', slot: 'main', required: true }],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'message', 'cta_label'],
      optional: ['show_cta'],
      slots: ['illustration', 'helpText'],
    },
    requiredComponents: ['Button'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['feedback', 'empty', 'state', 'no-data'],
  },
  {
    id: 'feedback.confirmation',
    name: 'Confirmation',
    category: 'feedback',
    description: 'Confirmation dialog for important actions',
    skeleton: {
      shell: 'centered-card',
      page: 'feedback-page',
      sections: [
        {
          id: 'confirmation-dialog',
          name: 'Confirmation Dialog',
          slot: 'main',
          required: true,
        },
      ],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'message', 'confirm_label', 'cancel_label'],
      optional: ['is_destructive'],
      slots: ['warningIcon', 'details'],
    },
    requiredComponents: ['Button', 'Card'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['feedback', 'confirmation', 'dialog', 'warning'],
  },
  {
    id: 'feedback.success',
    name: 'Success',
    category: 'feedback',
    description: 'Success state screen with confirmation message',
    skeleton: {
      shell: 'centered',
      page: 'feedback-page',
      sections: [{ id: 'success-message', name: 'Success Message', slot: 'main', required: true }],
    },
    layout: centeredLayout,
    customizable: {
      texts: ['title', 'message', 'cta_label'],
      optional: ['show_cta'],
      slots: ['icon', 'details', 'additionalActions'],
    },
    requiredComponents: ['Button'],
    version: '1.0.0',
    created: '2026-02-01',
    updated: '2026-02-01',
    tags: ['feedback', 'success', 'confirmation', 'state'],
  },
];

export function listTemplateDefinitions(): ScreenTemplateDefinition[] {
  return [...SCREEN_TEMPLATE_DEFINITIONS];
}

export function listTemplateDefinitionsByCategory(
  category: TemplateCategory
): ScreenTemplateDefinition[] {
  return SCREEN_TEMPLATE_DEFINITIONS.filter(template => template.category === category);
}

export function searchTemplateDefinitions(keyword: string): ScreenTemplateDefinition[] {
  const query = keyword.trim().toLowerCase();
  if (!query) {
    return listTemplateDefinitions();
  }

  return SCREEN_TEMPLATE_DEFINITIONS.filter(template => {
    return (
      template.id.toLowerCase().includes(query) ||
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });
}

export function loadTemplateDefinition(templateId: string): ScreenTemplateDefinition | null {
  return SCREEN_TEMPLATE_DEFINITIONS.find(template => template.id === templateId) ?? null;
}
