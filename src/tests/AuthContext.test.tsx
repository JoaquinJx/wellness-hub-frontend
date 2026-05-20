import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock the api module
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

const TestConsumer: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>loading</div>;
  return <div>{user ? `logged-in:${user.email}` : 'logged-out'}</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows loading initially then logged-out when no token', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('logged-out')).toBeTruthy();
    });
  });

  it('fetches profile when token exists in localStorage', async () => {
    const { default: api } = await import('../services/api');
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { id: 1, email: 'test@example.com' },
    });

    localStorage.setItem('token', 'valid-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('logged-in:test@example.com')).toBeTruthy();
    });
  });

  it('clears token when profile fetch fails (invalid token)', async () => {
    const { default: api } = await import('../services/api');
    (api.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Unauthorized'));

    localStorage.setItem('token', 'bad-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('logged-out')).toBeTruthy();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('logs out when auth:unauthorized event fires', async () => {
    const { default: api } = await import('../services/api');
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { id: 1, email: 'test@example.com' },
    });

    localStorage.setItem('token', 'valid-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('logged-in:test@example.com')).toBeTruthy();
    });

    act(() => {
      window.dispatchEvent(new Event('auth:unauthorized'));
    });

    await waitFor(() => {
      expect(screen.getByText('logged-out')).toBeTruthy();
    });
  });
});
