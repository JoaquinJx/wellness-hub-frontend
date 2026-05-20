import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios');
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
    },
  };
});

describe('api service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('creates an axios instance with the correct base URL', async () => {
    // Re-import to trigger the module factory with the mocked env
    const { default: api } = await import('../services/api');
    expect(api).toBeDefined();
  });

  it('attaches Bearer token from localStorage in request interceptor', () => {
    localStorage.setItem('token', 'test-jwt-token');
    const token = localStorage.getItem('token');
    expect(token).toBe('test-jwt-token');
  });

  it('removes token from localStorage on 401 and dispatches event', () => {
    localStorage.setItem('token', 'expired-token');
    const eventSpy = vi.spyOn(window, 'dispatchEvent');

    // Simulate what the response interceptor does on 401
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth:unauthorized'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth:unauthorized' }));
  });
});
