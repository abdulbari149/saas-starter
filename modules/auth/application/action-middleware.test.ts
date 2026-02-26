import { z } from 'zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  redirectMock,
  getCurrentUserMock,
  getTeamForCurrentUserMock
} = vi.hoisted(() => ({
  redirectMock: vi.fn(() => {
    throw new Error('redirected');
  }),
  getCurrentUserMock: vi.fn(),
  getTeamForCurrentUserMock: vi.fn()
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock
}));

vi.mock('@/modules/auth/application/user', () => ({
  getCurrentUser: getCurrentUserMock
}));

vi.mock('@/modules/teams/application/queries', () => ({
  getTeamForCurrentUser: getTeamForCurrentUserMock
}));

import {
  validatedAction,
  validatedActionWithUser,
  withTeam
} from './action-middleware';

describe('validatedAction', () => {
  it('returns zod error for invalid form data', async () => {
    const schema = z.object({ email: z.string().email() });
    const action = vi.fn();
    const wrapped = validatedAction(schema, action);

    const formData = new FormData();
    formData.set('email', 'bad-email');

    const result = await wrapped({}, formData);

    expect(result).toEqual({ error: 'Invalid email address' });
    expect(action).not.toHaveBeenCalled();
  });

  it('calls action with parsed values for valid data', async () => {
    const schema = z.object({ email: z.string().email() });
    const action = vi.fn().mockResolvedValue({ ok: true });
    const wrapped = validatedAction(schema, action);

    const formData = new FormData();
    formData.set('email', 'test@example.com');

    const result = await wrapped({}, formData);

    expect(action).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      formData
    );
    expect(result).toEqual({ ok: true });
  });
});

describe('validatedActionWithUser', () => {
  beforeEach(() => {
    getCurrentUserMock.mockReset();
  });

  it('throws if user is not authenticated', async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const schema = z.object({ name: z.string() });
    const action = vi.fn();
    const wrapped = validatedActionWithUser(schema, action);

    await expect(wrapped({}, new FormData())).rejects.toThrow(
      'User is not authenticated'
    );
    expect(action).not.toHaveBeenCalled();
  });

  it('calls action with authenticated user and parsed data', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      name: null
    };
    getCurrentUserMock.mockResolvedValue(user);

    const schema = z.object({ name: z.string().min(1) });
    const action = vi.fn().mockResolvedValue({ success: true });
    const wrapped = validatedActionWithUser(schema, action);

    const formData = new FormData();
    formData.set('name', 'Abdul');

    const result = await wrapped({}, formData);

    expect(action).toHaveBeenCalledWith({ name: 'Abdul' }, formData, user);
    expect(result).toEqual({ success: true });
  });
});

describe('withTeam', () => {
  beforeEach(() => {
    getCurrentUserMock.mockReset();
    getTeamForCurrentUserMock.mockReset();
    redirectMock.mockClear();
  });

  it('redirects unauthenticated users', async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const wrapped = withTeam(async () => ({ ok: true }));

    await expect(wrapped(new FormData())).rejects.toThrow('redirected');
    expect(redirectMock).toHaveBeenCalledWith('/sign-in');
  });

  it('throws when team is missing', async () => {
    getCurrentUserMock.mockResolvedValue({ id: 1 });
    getTeamForCurrentUserMock.mockResolvedValue(null);
    const wrapped = withTeam(async () => ({ ok: true }));

    await expect(wrapped(new FormData())).rejects.toThrow('Team not found');
  });
});
