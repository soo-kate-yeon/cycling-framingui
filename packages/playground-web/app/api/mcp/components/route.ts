/**
 * GET /api/mcp/components — UI 컴포넌트 카탈로그 목록 API
 * [SPEC-MCP-007:E-003] fetchComponentList() 지원
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';

/**
 * 컴포넌트 카탈로그 (30개 컴포넌트, 3 tier)
 * mcp-server의 component-registry.ts 데이터를 서버 사이드로 이전
 */
const COMPONENT_CATALOG = [
  // Tier 1: Core Components (15개)
  {
    id: 'button',
    name: 'Button',
    category: 'core',
    tier: 1,
    description: 'Interactive button component with multiple variants and sizes',
    variantsCount: 6,
    hasSubComponents: false,
  },
  {
    id: 'input',
    name: 'Input',
    category: 'core',
    tier: 1,
    description: 'Text input field with validation support',
    variantsCount: 1,
    hasSubComponents: false,
  },
  {
    id: 'label',
    name: 'Label',
    category: 'core',
    tier: 1,
    description: 'Form label component with accessibility support',
    variantsCount: 1,
    hasSubComponents: false,
  },
  {
    id: 'card',
    name: 'Card',
    category: 'core',
    tier: 1,
    description: 'Container card with header, content, and footer sections',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'core',
    tier: 1,
    description: 'Badge component for status and labels',
    variantsCount: 4,
    hasSubComponents: false,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'core',
    tier: 1,
    description: 'Avatar component with image and fallback support',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'separator',
    name: 'Separator',
    category: 'core',
    tier: 1,
    description: 'Visual separator line component',
    variantsCount: 2,
    hasSubComponents: false,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'core',
    tier: 1,
    description: 'Checkbox input component with indeterminate state',
    variantsCount: 1,
    hasSubComponents: false,
  },
  {
    id: 'radio-group',
    name: 'RadioGroup',
    category: 'core',
    tier: 1,
    description: 'Radio button group for single selection',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'core',
    tier: 1,
    description: 'Toggle switch component for boolean states',
    variantsCount: 1,
    hasSubComponents: false,
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'core',
    tier: 1,
    description: 'Multi-line text input area',
    variantsCount: 1,
    hasSubComponents: false,
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    category: 'core',
    tier: 1,
    description: 'Loading skeleton placeholder component',
    variantsCount: 1,
    hasSubComponents: false,
  },
  {
    id: 'scroll-area',
    name: 'ScrollArea',
    category: 'core',
    tier: 1,
    description: 'Custom scrollable area with styled scrollbar',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'form',
    name: 'Form',
    category: 'core',
    tier: 1,
    description: 'Form component with validation and error handling',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'select',
    name: 'Select',
    category: 'core',
    tier: 1,
    description: 'Dropdown select component with search support',
    variantsCount: 1,
    hasSubComponents: true,
  },
  // Tier 2: Complex Components (10개)
  {
    id: 'dialog',
    name: 'Dialog',
    category: 'complex',
    tier: 2,
    description: 'Modal dialog component with overlay and animations',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'dropdown-menu',
    name: 'DropdownMenu',
    category: 'complex',
    tier: 2,
    description: 'Contextual dropdown menu with nested items',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'table',
    name: 'Table',
    category: 'complex',
    tier: 2,
    description: 'Data table component with sorting and pagination',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'complex',
    tier: 2,
    description: 'Tabbed interface component with keyboard navigation',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'complex',
    tier: 2,
    description: 'Toast notification system with queue management',
    variantsCount: 4,
    hasSubComponents: true,
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'complex',
    tier: 2,
    description: 'Tooltip component with positioning and delay',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'popover',
    name: 'Popover',
    category: 'complex',
    tier: 2,
    description: 'Popover component with smart positioning',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'sheet',
    name: 'Sheet',
    category: 'complex',
    tier: 2,
    description: 'Slide-out panel component from screen edges',
    variantsCount: 4,
    hasSubComponents: true,
  },
  {
    id: 'alert-dialog',
    name: 'AlertDialog',
    category: 'complex',
    tier: 2,
    description: 'Alert dialog for important confirmations',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'progress',
    name: 'Progress',
    category: 'complex',
    tier: 2,
    description: 'Progress bar component with percentage tracking',
    variantsCount: 1,
    hasSubComponents: false,
  },
  // Tier 3: Advanced Components (5개)
  {
    id: 'sidebar',
    name: 'Sidebar',
    category: 'advanced',
    tier: 3,
    description: 'Collapsible sidebar navigation with sections and items',
    variantsCount: 2,
    hasSubComponents: true,
  },
  {
    id: 'navigation-menu',
    name: 'NavigationMenu',
    category: 'advanced',
    tier: 3,
    description: 'Accessible navigation menu with dropdown support',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'advanced',
    tier: 3,
    description: 'Breadcrumb navigation component with custom separators',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'command',
    name: 'Command',
    category: 'advanced',
    tier: 3,
    description: 'Command palette component with search and keyboard shortcuts',
    variantsCount: 1,
    hasSubComponents: true,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'advanced',
    tier: 3,
    description: 'Interactive calendar component with date selection',
    variantsCount: 1,
    hasSubComponents: false,
  },
];

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    return NextResponse.json(
      {
        success: true,
        components: COMPONENT_CATALOG,
        count: COMPONENT_CATALOG.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-store',
          Vary: 'Authorization',
          ...auth.rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    console.error('[MCP Components] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
