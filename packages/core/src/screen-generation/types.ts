/**
 * @framingui/core - Screen Definition Type Definitions
 * Type-safe screen definition interfaces for declarative screen generation
 * [SPEC-LAYOUT-002] [PHASE-1]
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Component type enum - 20 component types from SPEC-COMPONENT-001-B
 * Primitive: Button, Input, Text, Heading, Checkbox, Radio, Switch, Slider, Badge, Avatar
 * Composed: Card, Modal, Tabs, Table, Link, List, Image, Form, Dropdown, Progress
 */
export const SCREEN_COMPONENT_TYPES = [
  'Button',
  'Input',
  'Text',
  'Heading',
  'Checkbox',
  'Radio',
  'Switch',
  'Slider',
  'Badge',
  'Avatar',
  'Card',
  'Modal',
  'Tabs',
  'Table',
  'Link',
  'List',
  'Image',
  'Form',
  'Dropdown',
  'Progress',
] as const;

export type ComponentType = (typeof SCREEN_COMPONENT_TYPES)[number];

/**
 * Component Definition - Specifies a component instance
 * Supports nested children and slot-based layout assignment
 */
export interface ComponentDefinition {
  /** Component type from the 20 available component types */
  type: ComponentType;

  /** Component props (key-value pairs) */
  props: Record<string, unknown>;

  /** Child components or text content */
  children?: (ComponentDefinition | string)[];

  /** Layout slot assignment for positioning within section */
  slot?: string;
}

/**
 * Responsive Overrides - Section-level responsive configuration
 * Allows breakpoint-specific layout adjustments
 */
export interface ResponsiveOverrides {
  /** Small devices override (640px+) */
  sm?: Record<string, unknown>;

  /** Medium devices override (768px+) */
  md?: Record<string, unknown>;

  /** Large devices override (1024px+) */
  lg?: Record<string, unknown>;

  /** Extra large devices override (1280px+) */
  xl?: Record<string, unknown>;

  /** 2X large devices override (1536px+) */
  '2xl'?: Record<string, unknown>;
}

/**
 * Section Definition - Layout section with components
 * Represents a section pattern instance with components
 */
export interface SectionDefinition {
  /** Section identifier (unique within screen) */
  id: string;

  /** Section pattern token ID (e.g., "section.grid-4") */
  pattern: string;

  /** Components within this section */
  components: ComponentDefinition[];

  /** Responsive overrides for this section */
  responsive?: ResponsiveOverrides;
}

/**
 * Screen Metadata - Optional metadata for screen definition
 * Tracks authorship, versioning, and categorization
 */
export interface ScreenMeta {
  /** Screen author */
  author?: string;

  /** Creation timestamp (ISO 8601) */
  createdAt?: string;

  /** Screen version (semver) */
  version?: string;

  /** Categorization tags */
  tags?: string[];
}

/**
 * Screen Definition - Complete declarative screen specification
 * Defines a screen using layout tokens and component definitions
 */
export interface ScreenDefinition {
  /** Unique screen identifier (kebab-case) */
  id: string;

  /** Human-readable screen name */
  name: string;

  /** Optional screen description */
  description?: string;

  /** Shell token ID (e.g., "shell.web.dashboard") */
  shell: string;

  /** Page layout token ID (e.g., "page.dashboard") */
  page: string;

  /** Theme ID for token resolution (default: "default") */
  themeId?: string;

  /** Section definitions that make up the screen */
  sections: SectionDefinition[];

  /** Optional metadata */
  meta?: ScreenMeta;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if value is a ComponentDefinition
 */
export function isComponentDefinition(value: unknown): value is ComponentDefinition {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return typeof obj.type === 'string' && typeof obj.props === 'object';
}

/**
 * Type guard to check if value is a ScreenDefinition
 */
export function isScreenDefinition(value: unknown): value is ScreenDefinition {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.shell === 'string' &&
    typeof obj.page === 'string' &&
    Array.isArray(obj.sections)
  );
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Validation context for screen definitions
 * Used during validation to provide additional context
 */
export interface ValidationContext {
  /** Available shell token IDs */
  availableShells?: string[];

  /** Available page token IDs */
  availablePages?: string[];

  /** Available section pattern token IDs */
  availableSections?: string[];

  /** Available theme IDs */
  availableThemes?: string[];

  /** Strict mode - fail on warnings */
  strict?: boolean;
}
