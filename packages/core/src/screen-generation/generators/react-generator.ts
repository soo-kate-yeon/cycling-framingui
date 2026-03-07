/**
 * @framingui/core - React Component Generator
 * Generates React functional components from ResolvedScreen
 * [SPEC-LAYOUT-002] [PHASE-3]
 */

import type { ResolvedScreen, ResolvedSection, ResolvedComponent } from '../resolver/index.js';
import type { GeneratorOptions, GeneratorResult, ComponentGenerationContext } from './types.js';
import {
  pascalCase,
  camelCase,
  generateImports,
  formatCode,
  indent,
  escapeJSX,
  propValueToJSX,
} from './utils.js';
import { generateComponentClasses } from './tailwind-generator.js';

// ============================================================================
// TypeScript Interface Generation
// ============================================================================

/**
 * Generate TypeScript interface for component props
 *
 * @param component - Resolved component
 * @returns TypeScript interface code
 *
 * @example
 * ```typescript
 * const component = {
 *   type: 'Button',
 *   schema: {
 *     props: [
 *       { name: 'variant', type: 'string', required: false },
 *       { name: 'children', type: 'React.ReactNode', required: true }
 *     ]
 *   }
 * };
 *
 * const code = generateComponentInterface(component);
 * // interface ButtonProps {
 * //   variant?: string;
 * //   children: React.ReactNode;
 * // }
 * ```
 */
export function generateComponentInterface(component: ResolvedComponent): string {
  const interfaceName = `${pascalCase(component.type)}Props`;
  const lines: string[] = [];

  lines.push(`interface ${interfaceName} {`);

  for (const propDef of component.schema.props) {
    const optionalMarker = propDef.required ? '' : '?';
    const propType = propDef.type || 'unknown';

    // Add JSDoc comment
    if (propDef.description) {
      lines.push(`  /** ${propDef.description} */`);
    }

    lines.push(`  ${propDef.name}${optionalMarker}: ${propType};`);
  }

  lines.push('}');

  return lines.join('\n');
}

// ============================================================================
// Component JSX Generation
// ============================================================================

/**
 * Generate JSX for a component and its children
 *
 * @param component - Resolved component
 * @param context - Generation context
 * @returns JSX code string
 *
 * @example
 * ```typescript
 * const component = {
 *   type: 'Button',
 *   props: { variant: 'primary' },
 *   children: ['Click me']
 * };
 *
 * const jsx = generateComponentJSX(component, context);
 * // <button className="bg-primary-500 p-4">Click me</button>
 * ```
 */
export function generateComponentJSX(
  component: ResolvedComponent,
  context: ComponentGenerationContext
): string {
  const lines: string[] = [];
  const children = getRenderableChildren(component);

  // Generate opening tag
  const tagName = getJSXTagName(component.type);
  const attributes = generateJSXAttributes(component, context);

  if (children.length === 0) {
    // Self-closing tag
    lines.push(`<${tagName}${attributes} />`);
  } else {
    // Opening tag
    lines.push(`<${tagName}${attributes}>`);

    // Children
    for (const child of children) {
      if (typeof child === 'string') {
        // Text content
        lines.push(indent(escapeJSX(child), context.depth + 1));
      } else {
        // Child component
        const childContext: ComponentGenerationContext = {
          ...context,
          depth: context.depth + 1,
          parentType: component.type,
        };
        const childJSX = generateComponentJSX(child, childContext);
        lines.push(indent(childJSX, 1));
      }
    }

    // Closing tag
    lines.push(`</${tagName}>`);
  }

  return lines.join('\n');
}

function getRenderableChildren(component: ResolvedComponent): Array<ResolvedComponent | string> {
  if (component.children && component.children.length > 0) {
    return component.children;
  }

  const propChildren = component.props.children;
  if (typeof propChildren === 'string') {
    return [propChildren];
  }

  if (Array.isArray(propChildren)) {
    return propChildren.filter(
      (child): child is ResolvedComponent | string =>
        typeof child === 'string' || (typeof child === 'object' && child !== null)
    );
  }

  return [];
}

/**
 * Get JSX tag name for component type
 *
 * @param type - Component type
 * @returns JSX tag name
 */
function getJSXTagName(type: string): string {
  // Map component types to HTML elements
  const tagMap: Record<string, string> = {
    Button: 'button',
    Input: 'input',
    Text: 'span',
    Heading: 'h2',
    Checkbox: 'input',
    Radio: 'input',
    Switch: 'button',
    Slider: 'input',
    Badge: 'span',
    Avatar: 'img',
    Card: 'div',
    Modal: 'div',
    Tabs: 'div',
    Table: 'table',
    Link: 'a',
    List: 'ul',
    Image: 'img',
    Form: 'form',
    Dropdown: 'select',
    Progress: 'progress',
  };

  return tagMap[type] || 'div';
}

/**
 * Generate JSX attributes for component
 *
 * @param component - Resolved component
 * @param context - Generation context
 * @returns JSX attributes string
 */
function generateJSXAttributes(
  component: ResolvedComponent,
  context: ComponentGenerationContext
): string {
  const attributes: string[] = [];
  const propClassName =
    typeof component.props.className === 'string' ? component.props.className.trim() : '';

  // Add className based on CSS framework
  if (context.cssFramework === 'tailwind') {
    const classes = generateComponentClasses(component);
    const mergedClassName = mergeClassNames(classes.join(' '), propClassName);
    if (mergedClassName) {
      attributes.push(`className="${mergedClassName}"`);
    }
  } else if (context.cssFramework === 'css-modules') {
    const className = camelCase(component.type);
    if (propClassName) {
      attributes.push(`className={\`${'${styles.' + className + '}'} ${propClassName}\`}`);
    } else {
      attributes.push(`className={styles.${className}}`);
    }
    context.imports.add('styles');
  } else if (propClassName) {
    attributes.push(`className="${propClassName}"`);
  }

  // Add component props (excluding children)
  for (const [propName, propValue] of Object.entries(component.props)) {
    if (propName === 'children' || propName === 'className') {
      continue;
    }

    const jsxValue = propValueToJSX(propValue);
    attributes.push(`${propName}=${jsxValue}`);
  }

  // Add accessibility attributes
  if (component.schema.a11y.role) {
    attributes.push(`role="${component.schema.a11y.role}"`);
  }

  return attributes.length > 0 ? ' ' + attributes.join(' ') : '';
}

function mergeClassNames(...classNames: string[]): string {
  return classNames
    .flatMap(className => className.split(/\s+/))
    .filter(Boolean)
    .filter((className, index, all) => all.indexOf(className) === index)
    .join(' ');
}

// ============================================================================
// Component Function Generation
// ============================================================================

/**
 * Generate React functional component
 *
 * @param component - Resolved component
 * @param options - Generator options
 * @returns Component function code
 *
 * @example
 * ```typescript
 * const component = {
 *   type: 'Button',
 *   schema: { props: [...] },
 *   props: { variant: 'primary' },
 *   children: ['Click me']
 * };
 *
 * const code = generateReactComponentFunction(component, options);
 * // export const Button: React.FC<ButtonProps> = ({ variant, children }) => {
 * //   return (
 * //     <button className="bg-primary-500">
 * //       {children}
 * //     </button>
 * //   );
 * // };
 * ```
 */
function _generateReactComponentFunction(
  component: ResolvedComponent,
  options: GeneratorOptions
): string {
  const componentName = pascalCase(component.type);
  const propsInterfaceName = `${componentName}Props`;
  const lines: string[] = [];

  // Extract prop names for destructuring
  const propNames = component.schema.props.map(p => p.name);
  const propsDestructure = propNames.length > 0 ? `{ ${propNames.join(', ')} }` : '';

  // Function signature
  if (options.includeTypes !== false) {
    lines.push(
      `export const ${componentName}: React.FC<${propsInterfaceName}> = (${propsDestructure}) => {`
    );
  } else {
    lines.push(`export const ${componentName} = (${propsDestructure}) => {`);
  }

  // Function body
  lines.push('  return (');

  // Generate JSX
  const context: ComponentGenerationContext = {
    depth: 2,
    imports: new Set<string>(),
    cssFramework: options.cssFramework || 'tailwind',
    format: options.format || 'typescript',
  };

  const jsx = generateComponentJSX(component, context);
  lines.push(indent(jsx, 2));

  lines.push('  );');
  lines.push('};');

  return lines.join('\n');
}

// ============================================================================
// Component Tree Generation
// ============================================================================

/**
 * Generate component tree from resolved sections
 *
 * Creates a nested component structure representing the screen layout.
 *
 * @param sections - Resolved sections
 * @param options - Generator options
 * @returns Component tree JSX code
 */
export function generateComponentTree(
  sections: ResolvedSection[],
  options: GeneratorOptions
): string {
  const lines: string[] = [];

  for (const section of sections) {
    // Section wrapper
    lines.push(`<section id="${section.id}">`);

    // Components in section
    for (const component of section.components) {
      const context: ComponentGenerationContext = {
        depth: 1,
        imports: new Set<string>(),
        cssFramework: options.cssFramework || 'tailwind',
        format: options.format || 'typescript',
      };

      const componentJSX = generateComponentJSX(component, context);
      lines.push(indent(componentJSX, 1));
    }

    lines.push('</section>');
  }

  return lines.join('\n');
}

// ============================================================================
// Screen Component Generation
// ============================================================================

/**
 * Generate complete screen component from resolved screen
 *
 * Creates a React functional component representing the entire screen,
 * including all sections and nested components.
 *
 * @param screen - Resolved screen
 * @param options - Generator options
 * @returns Generated React component code
 *
 * @example
 * ```typescript
 * const screen = resolveScreen(screenDefinition);
 * const result = generateReactComponent(screen, {
 *   format: 'typescript',
 *   cssFramework: 'tailwind',
 *   includeTypes: true
 * });
 *
 * console.log(result.code);
 * // import React from 'react';
 * //
 * // interface DashboardScreenProps {}
 * //
 * // export const DashboardScreen: React.FC<DashboardScreenProps> = () => {
 * //   return (
 * //     <div className="screen">
 * //       <section id="stats">
 * //         ...
 * //       </section>
 * //     </div>
 * //   );
 * // };
 * ```
 */
export function generateReactComponent(
  screen: ResolvedScreen,
  options: GeneratorOptions = {}
): GeneratorResult {
  const startTime = performance.now();

  const imports: Record<string, string[]> = {
    react: ['default as React'],
  };

  const code: string[] = [];
  const warnings: string[] = [];

  // Add CSS imports if needed
  if (options.cssFramework === 'css-modules') {
    imports['./styles.module.css'] = ['default as styles'];
  }

  // Generate screen component
  const screenName = pascalCase(screen.id.replace(/-screen$/, '')) + 'Screen';
  const propsInterfaceName = `${screenName}Props`;

  // Interface (empty for screen component)
  if (options.includeTypes !== false) {
    code.push(`interface ${propsInterfaceName} {}`);
    code.push('');
  }

  // Component function
  const lines: string[] = [];

  if (options.includeTypes !== false) {
    lines.push(`export const ${screenName}: React.FC<${propsInterfaceName}> = () => {`);
  } else {
    lines.push(`export const ${screenName} = () => {`);
  }

  lines.push('  return (');
  lines.push('    <div className="screen" data-screen-id="' + screen.id + '">');

  // Generate component tree
  const componentTree = generateComponentTree(screen.sections, options);
  lines.push(indent(componentTree, 3));

  lines.push('    </div>');
  lines.push('  );');
  lines.push('};');

  code.push(lines.join('\n'));

  // Also generate individual component functions if requested
  const componentFiles: { path: string; content: string; type: 'component' }[] = [];

  if (options.includeTypes !== false) {
    // Generate type definitions file
    const typeDefs: string[] = [];
    typeDefs.push("import React from 'react';");
    typeDefs.push('');

    const generatedTypes = new Set<string>();
    for (const section of screen.sections) {
      for (const component of section.components) {
        if (!generatedTypes.has(component.type)) {
          typeDefs.push(generateComponentInterface(component));
          typeDefs.push('');
          generatedTypes.add(component.type);
        }
      }
    }

    componentFiles.push({
      path: 'types.ts',
      content: typeDefs.join('\n'),
      type: 'component',
    });
  }

  // Combine imports and code
  const importCode = generateImports(imports, options.format || 'typescript');
  const fullCode = importCode + code.join('\n');

  // Format code
  const formatted = options.prettier !== false ? formatCode(fullCode) : fullCode;

  const endTime = performance.now();

  return {
    code: formatted,
    files: componentFiles,
    warnings,
    meta: {
      duration: endTime - startTime,
      componentCount: screen.sections.reduce((sum, s) => sum + s.components.length, 0),
      lineCount: formatted.split('\n').length,
    },
  };
}
