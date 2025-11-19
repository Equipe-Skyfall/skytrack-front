/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import '@testing-library/jest-dom';
// Mock env-based config to avoid `import.meta` usage during ts-jest compile
jest.mock('../services/api/config', () => ({
  API_BASE: 'http://localhost:3000',
  AUTH_BASE: 'http://localhost:3001',
}));
// Mock axios-based API client to avoid import.meta and axios instance creation during tests
jest.mock('../services/api/axios', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
  API_BASE: 'http://localhost:3000',
  default: {},
}));
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Perfil from '../components/profile/Perfil';
import * as AuthModule from '../context/AuthContext';
import * as ThemeModule from '../contexts/ThemeContext';

describe('Perfil component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
    // restore global.fetch
    // @ts-ignore
    delete global.fetch;
  });

  it('renders perfil and outros usuários when fetch succeeds', async () => {
    // Mock hooks
    jest.spyOn(AuthModule, 'useAuth').mockReturnValue({ user: { id: '1', username: 'admin' }, token: 'fake-token', logout: jest.fn() } as any);
    jest.spyOn(ThemeModule, 'useTheme').mockReturnValue({ isDarkMode: false, toggleTheme: jest.fn() } as any);

    // Mock sequential fetch responses: profile then users
    const profileResponse = { success: true, data: { id: '1', username: 'admin', email: 'a@b.com', role: 'ADMIN' } };
    const usersResponse = { success: true, data: [ { id: '1', username: 'admin', email: 'a@b.com', role: 'ADMIN' }, { id: '2', username: 'user2', email: 'u2@b.com', role: 'USER' } ] };

    // @ts-ignore
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: async () => profileResponse }))
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: async () => usersResponse }));

    render(<Perfil />);

    // Wait for main heading
    await waitFor(() => expect(screen.getByText('Perfil')).toBeInTheDocument());

    // Principal user name should appear
    expect(screen.getByText('admin')).toBeInTheDocument();

    // Outros usuários heading and second user should appear
    expect(screen.getByText('Outros usuários')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('user2')).toBeInTheDocument());
  });

  it('shows error UI when profile fetch fails', async () => {
    jest.spyOn(AuthModule, 'useAuth').mockReturnValue({ user: null, token: 'fake-token', logout: jest.fn() } as any);
    jest.spyOn(ThemeModule, 'useTheme').mockReturnValue({ isDarkMode: false, toggleTheme: jest.fn() } as any);

    // profile fetch returns non-ok
    // @ts-ignore
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ ok: false, status: 500 }));

    render(<Perfil />);

    await waitFor(() => expect(screen.getByText(/Erro:/)).toBeInTheDocument());
    expect(screen.getByText(/Tentar Novamente/)).toBeInTheDocument();
  });
});
