import { afterEach, vi } from 'vitest';

process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test-auth-secret';

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
