import { afterEach, describe, expect, it, vi } from 'vitest';
import { jobsApi, setUnauthorizedHandler } from '@/lib/api';

describe('API client', () => {
  afterEach(() => {
    setUnauthorizedHandler(null);
    vi.restoreAllMocks();
  });

  it('invokes unauthorized handler on 401 responses and throws server message', async () => {
    const unauthorizedSpy = vi.fn();
    setUnauthorizedHandler(unauthorizedSpy);

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ msg: 'Token expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(jobsApi.getAll()).rejects.toThrow('Token expired');
    expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
  });
});
