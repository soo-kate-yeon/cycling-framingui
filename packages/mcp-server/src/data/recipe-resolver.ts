/**
 * Recipe Resolver Module
 * SPEC-MCP-004 Phase 4: Theme Recipes Auto-Application
 *
 * 테마에서 레시피를 조회하고 컴포넌트 className에 적용합니다.
 * (로컬 .moai/themes/generated/ 읽기 → framingui.com API fetch)
 */

import { fetchTheme } from '../api/data-client.js';
import type { ComponentNode } from '@framingui/core';

/**
 * 컴포넌트 타입과 variant에서 레시피 경로 생성
 *
 * 규칙:
 * - card + glass → recipes.card.glass
 * - button + primary → recipes.button.primary
 * - Text + hero → recipes.typography.hero (특수 케이스)
 * - Badge + neutral → recipes.badge.neutral
 */
function getRecipePath(componentType: string, variant?: string): string[] {
  if (!variant) {
    return [`recipes.${componentType.toLowerCase()}.default`];
  }

  const type = componentType.toLowerCase();
  const paths: string[] = [];

  // Typography 특수 처리 (Text → recipes.typography)
  if (type === 'text' || type === 'heading') {
    paths.push(`recipes.typography.${variant}`);
  }
  // 일반 컴포넌트
  else {
    paths.push(`recipes.${type}.${variant}`);
  }

  // Fallback: variant 없이 기본 레시피
  paths.push(`recipes.${type}.default`);
  paths.push(`recipes.${type}`);

  return paths;
}

/**
 * 중첩 객체에서 경로로 값 조회
 *
 * @example
 * getNestedValue({ a: { b: { c: 'value' } } }, 'a.b.c') → 'value'
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * 테마에서 레시피 조회
 *
 * @param themeId - 테마 ID
 * @param componentType - 컴포넌트 타입 (Card, Button, Text 등)
 * @param variant - 컴포넌트 variant (glass, primary, hero 등)
 * @returns 레시피 className 문자열 또는 undefined
 */
export async function resolveRecipe(
  themeId: string,
  componentType: string,
  variant?: string
): Promise<string | undefined> {
  try {
    const themeResult = await fetchTheme(themeId);
    if (!themeResult.ok) {
      return undefined;
    }
    const theme = themeResult.data as any;

    // recipes는 tokens 내부가 아니라 최상위 필드
    const recipes = theme.recipes || theme.tokens?.recipes;
    if (!recipes) {
      return undefined;
    }

    const paths = getRecipePath(componentType, variant);

    // 우선순위대로 레시피 경로 시도
    for (const path of paths) {
      const recipe = getNestedValue(recipes, path.replace('recipes.', ''));

      // 레시피가 문자열이면 반환
      if (typeof recipe === 'string') {
        return recipe;
      }

      // 레시피가 객체면 'base' 또는 'default' 키 확인
      if (recipe && typeof recipe === 'object') {
        if (typeof recipe.base === 'string') {
          return recipe.base;
        }
        if (typeof recipe.default === 'string') {
          return recipe.default;
        }
      }
    }

    return undefined;
  } catch (error) {
    console.warn(
      `[Recipe Resolver] Failed to resolve recipe for ${componentType}.${variant}:`,
      error
    );
    return undefined;
  }
}

/**
 * ComponentNode의 props.className에 레시피 병합
 *
 * 기존 className이 있으면 레시피를 앞에 추가합니다.
 *
 * @example
 * mergeClassName("p-4", "bg-white border") → "bg-white border p-4"
 */
function mergeClassName(existing: string | undefined, recipe: string): string {
  if (!existing) {
    return recipe;
  }

  // 중복 제거를 위해 Set 사용
  const existingClasses = existing.split(/\s+/).filter(Boolean);
  const recipeClasses = recipe.split(/\s+/).filter(Boolean);

  // 레시피 클래스를 앞에, 기존 클래스를 뒤에 (specificity 우선순위)
  const merged = [...new Set([...recipeClasses, ...existingClasses])];

  return merged.join(' ');
}

/**
 * ComponentNode에 레시피 적용 (재귀)
 *
 * @param node - 컴포넌트 노드
 * @param themeId - 테마 ID
 * @returns 레시피가 적용된 노드 (원본 수정하지 않음)
 */
export async function applyRecipeToNode(
  node: ComponentNode,
  themeId: string
): Promise<ComponentNode> {
  const result = { ...node };

  // variant가 있으면 레시피 조회
  if (result.type) {
    const variant = (result.props as any)?.variant;
    const recipe = await resolveRecipe(themeId, result.type, variant);

    if (recipe) {
      // props 복사 (immutability 보장)
      const currentProps = result.props || {};
      const existingClassName = (currentProps as any).className;

      result.props = {
        ...currentProps,
        className: mergeClassName(existingClassName, recipe),
      };
    }
  }

  // children 재귀 처리
  if (Array.isArray(result.children)) {
    const resolvedChildren = [];
    for (const child of result.children) {
      if (typeof child === 'object' && child !== null && 'type' in child) {
        resolvedChildren.push(await applyRecipeToNode(child as ComponentNode, themeId));
      } else {
        resolvedChildren.push(child);
      }
    }
    result.children = resolvedChildren;
  }

  return result;
}

/**
 * Blueprint의 모든 컴포넌트에 레시피 적용
 *
 * @param components - 컴포넌트 배열
 * @param themeId - 테마 ID
 * @returns 레시피가 적용된 컴포넌트 배열
 */
export async function applyRecipesToBlueprint(
  components: ComponentNode[],
  themeId: string
): Promise<ComponentNode[]> {
  return Promise.all(components.map(component => applyRecipeToNode(component, themeId)));
}

/**
 * 레시피 통계 계산
 *
 * @param components - 컴포넌트 배열
 * @param themeId - 테마 ID
 * @returns 적용된 레시피 개수
 */
export async function countAppliedRecipes(
  components: ComponentNode[],
  themeId: string
): Promise<number> {
  let count = 0;

  async function traverse(node: ComponentNode) {
    const variant = (node.props as any)?.variant;
    if (node.type && (await resolveRecipe(themeId, node.type, variant))) {
      count++;
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        if (typeof child === 'object' && child !== null && 'type' in child) {
          await traverse(child as ComponentNode);
        }
      }
    }
  }

  for (const component of components) {
    await traverse(component);
  }

  return count;
}

/**
 * 사용 가능한 모든 레시피 조회 (디버깅용)
 *
 * @param themeId - 테마 ID
 * @returns 레시피 경로 → className 매핑
 */
export async function getAllRecipes(themeId: string): Promise<Record<string, string>> {
  try {
    const themeResult = await fetchTheme(themeId);
    if (!themeResult.ok) {
      return {};
    }
    const theme = themeResult.data as any;

    // recipes는 tokens 내부가 아니라 최상위 필드
    const recipes = theme.recipes || theme.tokens?.recipes;
    if (!recipes) {
      return {};
    }

    const result: Record<string, string> = {};

    function traverse(obj: any, path: string = 'recipes') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof value === 'string') {
          result[currentPath] = value;
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath);
        }
      }
    }

    traverse(recipes);
    return result;
  } catch (error) {
    console.warn(`[Recipe Resolver] Failed to get all recipes for ${themeId}:`, error);
    return {};
  }
}
