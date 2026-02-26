import { describe, expect, it } from 'vitest';
import {
  comparePasswords,
  hashPassword,
  signToken,
  verifyToken
} from './session';

describe('session utilities', () => {
  it('hashes and verifies passwords', async () => {
    const password = 'admin12345';
    const hash = await hashPassword(password);

    await expect(comparePasswords(password, hash)).resolves.toBe(true);
    await expect(comparePasswords('wrong-pass', hash)).resolves.toBe(false);
  });

  it('signs and verifies session token', async () => {
    const payload = {
      user: { id: 99 },
      expires: new Date(Date.now() + 60_000).toISOString()
    };

    const token = await signToken(payload);
    const verified = await verifyToken(token);

    expect(verified.user.id).toBe(99);
    expect(typeof verified.expires).toBe('string');
  });

  it('rejects invalid tokens', async () => {
    await expect(verifyToken('not-a-real-token')).rejects.toThrow();
  });
});
