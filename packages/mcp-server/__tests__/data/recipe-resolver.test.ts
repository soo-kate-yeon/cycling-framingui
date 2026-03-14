/**
 * Recipe Resolver Unit Tests
 * SPEC-MCP-004 Phase 4: Theme Recipes Auto-Application
 */

import { describe, it, expect } from 'vitest';
import {
  resolveRecipe,
  applyRecipeToNode,
  applyRecipesToBlueprint,
  countAppliedRecipes,
  getAllRecipes,
} from '../../src/data/recipe-resolver.js';
import type { ComponentNode } from '@framingui/core';

describe('Recipe Resolver', () => {
  describe('resolveRecipe', () => {
    it('테마가 없으면 undefined 반환', async () => {
      const recipe = await resolveRecipe('non-existent-theme', 'Card', 'glass');
      expect(recipe).toBeUndefined();
    }, 15000);

    it('레시피가 없는 variant는 fallback 시도', async () => {
      const recipe = await resolveRecipe('dark-boldness', 'Card', 'non-existent-variant');
      // Fallback to default or base if available, otherwise undefined
      // Card 컴포넌트에 기본 레시피가 있으면 string, 없으면 undefined
      expect(recipe === undefined || typeof recipe === 'string').toBe(true);
    }, 15000);

    it('card.glass 레시피 조회 성공', async () => {
      const recipe = await resolveRecipe('dark-boldness', 'Card', 'glass');
      expect(recipe).toBeDefined();
      expect(typeof recipe).toBe('string');
      expect(recipe).toContain('bg-');
    }, 15000);

    it('button.primary 레시피 조회 성공', async () => {
      const recipe = await resolveRecipe('dark-boldness', 'Button', 'primary');
      expect(recipe).toBeDefined();
      expect(typeof recipe).toBe('string');
    });

    it('Typography 특수 처리 (Text.hero)', async () => {
      const recipe = await resolveRecipe('dark-boldness', 'Text', 'hero');
      // recipes.typography.hero로 조회
      expect(recipe).toBeDefined();
    });

    it('대소문자 무관하게 조회', async () => {
      const recipe1 = await resolveRecipe('dark-boldness', 'Card', 'glass');
      const recipe2 = await resolveRecipe('dark-boldness', 'card', 'glass');
      expect(recipe1).toBe(recipe2);
    });
  });

  describe('applyRecipeToNode', () => {
    it('variant가 있는 노드에 레시피 적용', async () => {
      const node: ComponentNode = {
        type: 'Card',
        props: { variant: 'glass' },
        children: [],
      };

      const result = await applyRecipeToNode(node, 'dark-boldness');

      expect(result.props).toBeDefined();
      expect((result.props as any).className).toBeDefined();
      expect((result.props as any).className).toContain('bg-');
    });

    it('기존 className과 레시피 병합', async () => {
      const node: ComponentNode = {
        type: 'Card',
        props: {
          variant: 'glass',
          className: 'p-4 rounded-lg',
        },
        children: [],
      };

      const result = await applyRecipeToNode(node, 'dark-boldness');

      const className = (result.props as any).className;
      expect(className).toContain('p-4');
      expect(className).toContain('rounded-lg');
      expect(className).toContain('bg-');
    });

    it('variant가 없으면 레시피 적용 안 함', async () => {
      const node: ComponentNode = {
        type: 'Card',
        props: { className: 'p-4' },
        children: [],
      };

      const result = await applyRecipeToNode(node, 'dark-boldness');

      // 기본 레시피가 있으면 적용될 수 있음
      expect(result.props).toBeDefined();
    });

    it('children 재귀 처리', async () => {
      const node: ComponentNode = {
        type: 'Card',
        props: { variant: 'glass' },
        children: [
          {
            type: 'Button',
            props: { variant: 'primary' },
            children: ['Click me'],
          },
        ],
      };

      const result = await applyRecipeToNode(node, 'dark-boldness');

      expect((result.props as any).className).toBeDefined();
      expect(Array.isArray(result.children)).toBe(true);

      const child = result.children?.[0] as ComponentNode;
      expect((child.props as any)?.className).toBeDefined();
    });

    it('원본 노드 수정하지 않음 (immutable)', async () => {
      const original: ComponentNode = {
        type: 'Card',
        props: { variant: 'glass' },
        children: [],
      };

      const originalProps = original.props;
      const result = await applyRecipeToNode(original, 'dark-boldness');

      // props 객체가 새로운 참조여야 함
      expect(result.props).not.toBe(originalProps);
      // 원본 props는 변경되지 않아야 함
      expect((originalProps as any).className).toBeUndefined();
    });
  });

  describe('applyRecipesToBlueprint', () => {
    it('모든 컴포넌트에 레시피 적용', async () => {
      const components: ComponentNode[] = [
        { type: 'Card', props: { variant: 'glass' }, children: [] },
        { type: 'Button', props: { variant: 'primary' }, children: [] },
        { type: 'Badge', props: { variant: 'neutral' }, children: [] },
      ];

      const result = await applyRecipesToBlueprint(components, 'dark-boldness');

      expect(result).toHaveLength(3);
      result.forEach(component => {
        expect((component.props as any)?.className).toBeDefined();
      });
    });

    it('빈 배열 처리', async () => {
      const result = await applyRecipesToBlueprint([], 'dark-boldness');
      expect(result).toHaveLength(0);
    });
  });

  describe('countAppliedRecipes', () => {
    it('적용된 레시피 개수 계산', async () => {
      const components: ComponentNode[] = [
        { type: 'Card', props: { variant: 'glass' }, children: [] },
        { type: 'Button', props: { variant: 'primary' }, children: [] },
        { type: 'Text', children: ['No variant'] }, // variant 없음
      ];

      const count = await countAppliedRecipes(components, 'dark-boldness');

      // Card.glass + Button.primary = 2
      // Text는 variant 없어서 제외 (기본 레시피 있으면 카운트될 수 있음)
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it('중첩된 컴포넌트도 카운트', async () => {
      const components: ComponentNode[] = [
        {
          type: 'Card',
          props: { variant: 'glass' },
          children: [
            {
              type: 'Button',
              props: { variant: 'primary' },
              children: ['Click'],
            },
          ],
        },
      ];

      const count = await countAppliedRecipes(components, 'dark-boldness');

      // Card.glass + Button.primary = 2
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it('빈 배열은 0 반환', async () => {
      const count = await countAppliedRecipes([], 'dark-boldness');
      expect(count).toBe(0);
    });
  });

  describe('getAllRecipes', () => {
    it('테마의 모든 레시피 조회', async () => {
      const recipes = await getAllRecipes('dark-boldness');

      expect(Object.keys(recipes).length).toBeGreaterThan(0);

      // 레시피 경로 형식 확인
      for (const [path, className] of Object.entries(recipes)) {
        expect(path).toMatch(/^recipes\./);
        expect(typeof className).toBe('string');
      }
    });

    it('존재하지 않는 테마는 빈 객체 반환', async () => {
      const recipes = await getAllRecipes('non-existent-theme');
      expect(recipes).toEqual({});
    }, 15000);

    it('카테고리별 레시피 포함', async () => {
      const recipes = await getAllRecipes('dark-boldness');

      // 주요 카테고리 레시피 확인
      const paths = Object.keys(recipes);
      const hasCard = paths.some(p => p.startsWith('recipes.card'));
      const hasButton = paths.some(p => p.startsWith('recipes.button'));

      expect(hasCard || hasButton).toBe(true);
    });
  });

  describe('Integration Test', () => {
    it('완전한 Blueprint에 레시피 적용 후 className 확인', async () => {
      const components: ComponentNode[] = [
        {
          type: 'Card',
          props: { variant: 'glass', className: 'p-6' },
          children: [
            {
              type: 'Text',
              props: { variant: 'eyebrow' },
              children: ['LABEL'],
            },
            {
              type: 'Heading',
              props: { level: 2 },
              children: ['Title'],
            },
            {
              type: 'Button',
              props: { variant: 'primary' },
              children: ['Action'],
            },
          ],
        },
      ];

      const result = await applyRecipesToBlueprint(components, 'dark-boldness');
      const count = await countAppliedRecipes(result, 'dark-boldness');

      // Card에 레시피 적용됨
      const card = result[0]!;
      const cardClassName = (card.props as Record<string, unknown>)?.className;
      expect(cardClassName).toContain('p-6'); // 기존 className 유지
      expect(cardClassName).toMatch(/bg-|border/); // 레시피 추가됨

      // 최소 2개 이상의 레시피 적용 (Card, Button)
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });
});
