/**
 * MemoryCache 테스트
 * SPEC-MCP-007:S-004 - getStale() 메서드: TTL 만료 후에도 캐시 값 반환
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
// vitest에서 .js 확장자는 dist 파일을 참조할 수 있으므로 .ts 확장자로 직접 import
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MemoryCache } from '../auth/cache.ts';

describe('MemoryCache', () => {
  let cache: InstanceType<typeof MemoryCache<string>>;

  beforeEach(() => {
    cache = new MemoryCache<string>();
    vi.useRealTimers();
  });

  describe('set / get (기본 동작)', () => {
    it('TTL 이내에 get()으로 값을 반환한다', () => {
      cache.set('key1', 'value1', 10_000);
      expect(cache.get('key1')).toBe('value1');
    });

    it('존재하지 않는 키에 대해 null을 반환한다', () => {
      expect(cache.get('non-existent')).toBeNull();
    });

    it('TTL 만료 후 get()은 null을 반환한다', () => {
      vi.useFakeTimers();
      cache.set('key2', 'expired', 1_000);

      // TTL(1초) 이후로 시간 이동
      vi.advanceTimersByTime(1_001);

      expect(cache.get('key2')).toBeNull();
      vi.useRealTimers();
    });
  });

  describe('getStale()', () => {
    it('TTL 이내에 getStale()은 값을 반환한다', () => {
      cache.set('key3', 'fresh', 10_000);
      expect(cache.getStale('key3')).toBe('fresh');
    });

    it('TTL 만료 후에도 getStale()은 값을 반환한다 (stale 허용)', () => {
      vi.useFakeTimers();
      cache.set('key4', 'stale-value', 500);

      // TTL 만료
      vi.advanceTimersByTime(1_000);

      // getStale()은 만료 후에도 값을 반환해야 한다
      // 주의: get()을 먼저 호출하면 만료된 항목이 삭제됨
      expect(cache.getStale('key4')).toBe('stale-value');

      // get()은 만료된 항목을 삭제하고 null을 반환한다
      const freshCache = new MemoryCache<string>();
      freshCache.set('key4b', 'stale-value-b', 500);
      vi.advanceTimersByTime(1_000);
      expect(freshCache.get('key4b')).toBeNull();
      // get() 호출 후에는 항목이 삭제되어 getStale()도 null 반환
      expect(freshCache.getStale('key4b')).toBeNull();

      vi.useRealTimers();
    });

    it('키가 설정된 적 없으면 getStale()은 null을 반환한다', () => {
      expect(cache.getStale('never-set')).toBeNull();
    });

    it('delete() 후 getStale()은 null을 반환한다', () => {
      cache.set('key5', 'to-delete', 10_000);
      cache.delete('key5');
      expect(cache.getStale('key5')).toBeNull();
    });
  });

  describe('delete / clear', () => {
    it('delete()로 특정 키를 제거한다', () => {
      cache.set('key6', 'val6', 10_000);
      cache.delete('key6');
      expect(cache.get('key6')).toBeNull();
    });

    it('clear()로 모든 캐시를 비운다', () => {
      cache.set('a', 'aa', 10_000);
      cache.set('b', 'bb', 10_000);
      cache.clear();
      expect(cache.size()).toBe(0);
    });
  });

  describe('size()', () => {
    it('항목 추가 수만큼 size()가 증가한다', () => {
      expect(cache.size()).toBe(0);
      cache.set('s1', 'v1', 10_000);
      cache.set('s2', 'v2', 10_000);
      expect(cache.size()).toBe(2);
    });
  });
});
