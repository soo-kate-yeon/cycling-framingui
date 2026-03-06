/**
 * @framingui/core - Icon Library Module
 * Load and manage icon library definitions from .moai/icon-libraries/generated/
 * [SPEC-ICON-001]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getGeneratedDataDir } from './generated-data-dir.js';

// ============================================================================
// Icon Library Types
// ============================================================================

/** Size mapping for icon sizes */
export interface IconSizeMapping {
  xs?: number;
  sm: number;
  md: number;
  lg: number;
  xl?: number;
}

/** Framework-specific configuration */
export interface IconFrameworkConfig {
  packageName: string;
  importStatement: string;
  componentPattern: string;
  variants?: Record<string, string>;
}

/** Icon definition */
export interface IconDefinition {
  aliases: string[];
  category: string;
  tags: string[];
}

/** Icon Library Definition */
export interface IconLibrary {
  id: string;
  name: string;
  version: string;
  license: string;
  description: string;
  website: string;
  totalIcons: number;
  categories: string[];
  sizeMapping: IconSizeMapping;
  frameworks: {
    react: IconFrameworkConfig;
    vue: IconFrameworkConfig;
  };
  defaultVariant?: string;
  icons: Record<string, IconDefinition>;
}

/** Icon Library metadata for listing */
export interface IconLibraryMeta {
  id: string;
  name: string;
  description: string;
  version: string;
  license: string;
  totalIcons: number;
  categories: string[];
}

// ============================================================================
// Icon Library Directory Resolution
// ============================================================================

/**
 * Resolve icon libraries directory.
 * Priority:
 * 1. Consumer project .moai/icon-libraries/generated
 * 2. Monorepo root .moai/icon-libraries/generated
 * 3. Bundled package data copied into dist/bundled/icon-libraries/generated
 */
function getIconLibrariesDir(): string | null {
  return getGeneratedDataDir(import.meta.url, 'icon-libraries');
}

// ============================================================================
// Icon Library Loading Functions
// ============================================================================

/**
 * Load icon library from .moai/icon-libraries/generated/ directory
 * @param libraryId - Icon library identifier (kebab-case, e.g., "lucide", "heroicons")
 * @returns Loaded icon library or null if not found
 */
export function loadIconLibrary(libraryId: string): IconLibrary | null {
  // Security: Prevent path traversal attacks
  if (!libraryId || !/^[a-z0-9-]+$/.test(libraryId)) {
    return null;
  }

  const iconLibrariesDir = getIconLibrariesDir();
  if (!iconLibrariesDir || !existsSync(iconLibrariesDir)) {
    return null;
  }

  const libraryPath = join(iconLibrariesDir, `${libraryId}.json`);

  if (!existsSync(libraryPath)) {
    return null;
  }

  try {
    const content = readFileSync(libraryPath, 'utf-8');
    const library = JSON.parse(content) as IconLibrary;

    // Basic validation
    if (!library.id || !library.name || !library.frameworks) {
      console.warn(`Icon library ${libraryId} has invalid structure`);
      return null;
    }

    return library;
  } catch (error) {
    console.error(`Failed to load icon library ${libraryId}:`, error);
    return null;
  }
}

/**
 * List all available icon libraries from .moai/icon-libraries/generated/
 * @returns Array of icon library metadata
 */
export function listIconLibraries(): IconLibraryMeta[] {
  const iconLibrariesDir = getIconLibrariesDir();
  if (!iconLibrariesDir || !existsSync(iconLibrariesDir)) {
    return [];
  }

  const files = readdirSync(iconLibrariesDir).filter(f => f.endsWith('.json'));
  const libraries: IconLibraryMeta[] = [];

  for (const file of files) {
    const libraryId = file.replace('.json', '');
    const library = loadIconLibrary(libraryId);

    if (library) {
      libraries.push({
        id: library.id,
        name: library.name,
        description: library.description,
        version: library.version,
        license: library.license,
        totalIcons: library.totalIcons,
        categories: library.categories,
      });
    }
  }

  return libraries;
}

/**
 * Check if an icon library exists
 * @param libraryId - Icon library identifier
 * @returns true if icon library exists
 */
export function iconLibraryExists(libraryId: string): boolean {
  if (!libraryId || !/^[a-z0-9-]+$/.test(libraryId)) {
    return false;
  }

  const iconLibrariesDir = getIconLibrariesDir();
  if (!iconLibrariesDir) {
    return false;
  }

  return existsSync(join(iconLibrariesDir, `${libraryId}.json`));
}

// ============================================================================
// Icon Lookup Utilities
// ============================================================================

/**
 * Find an icon by name or alias in a library
 * @param library - Icon library to search
 * @param iconNameOrAlias - Icon name or alias to find
 * @returns Icon name if found, null otherwise
 */
export function findIcon(library: IconLibrary, iconNameOrAlias: string): string | null {
  const normalizedSearch = iconNameOrAlias.toLowerCase();

  // Direct match
  if (library.icons[normalizedSearch]) {
    return normalizedSearch;
  }

  // Search by alias
  for (const [iconName, icon] of Object.entries(library.icons)) {
    if (icon.aliases.some(alias => alias.toLowerCase() === normalizedSearch)) {
      return iconName;
    }
  }

  return null;
}

/**
 * Get icons by category
 * @param library - Icon library to search
 * @param category - Category to filter by
 * @returns Array of icon names in the category
 */
export function getIconsByCategory(library: IconLibrary, category: string): string[] {
  return Object.entries(library.icons)
    .filter(([, icon]) => icon.category === category)
    .map(([name]) => name);
}

/**
 * Search icons by tag
 * @param library - Icon library to search
 * @param tag - Tag to search for
 * @returns Array of icon names matching the tag
 */
export function searchIconsByTag(library: IconLibrary, tag: string): string[] {
  const normalizedTag = tag.toLowerCase();
  return Object.entries(library.icons)
    .filter(([, icon]) => icon.tags.some(t => t.toLowerCase().includes(normalizedTag)))
    .map(([name]) => name);
}

// ============================================================================
// Import Statement Generation
// ============================================================================

/**
 * Generate import statement for icons
 * @param library - Icon library
 * @param iconNames - Array of icon names to import
 * @param framework - Target framework ('react' | 'vue')
 * @returns Import statement string
 */
export function generateImportStatement(
  library: IconLibrary,
  iconNames: string[],
  framework: 'react' | 'vue'
): string {
  const config = library.frameworks[framework];
  if (!config) {
    return '';
  }

  // Convert icon names to component names
  const componentNames = iconNames.map(name => {
    const pascalName = name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    return config.componentPattern.replace('{PascalName}', pascalName);
  });

  return config.importStatement.replace('{icons}', componentNames.join(', '));
}

/**
 * Get the package name for an icon library
 * @param library - Icon library
 * @param framework - Target framework
 * @param variant - Optional variant (for heroicons: 'outline' | 'solid' | 'mini')
 * @returns Package name string
 */
export function getPackageName(
  library: IconLibrary,
  framework: 'react' | 'vue',
  variant?: string
): string {
  const config = library.frameworks[framework];
  if (!config) {
    return '';
  }

  // If variant specified and available, use it
  if (variant && config.variants && config.variants[variant]) {
    return config.variants[variant];
  }

  return config.packageName;
}
