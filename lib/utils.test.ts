import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges classes with tailwind conflict resolution', () => {
    expect(cn('px-2', 'px-4', 'text-sm')).toBe('px-4 text-sm');
  });

  it('skips falsey values', () => {
    expect(cn('font-medium', undefined, false && 'hidden')).toBe('font-medium');
  });
});
