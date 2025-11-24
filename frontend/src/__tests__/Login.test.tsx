import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mocks: useAuth, useTheme, react-router-dom useNavigate, TwoFactorAuthModal, and lucide-react icons
const mockLogin = jest.fn();
const mockVerify2FA = jest.fn();
const mockRequest2FACode = jest.fn();

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    verify2FA: mockVerify2FA,
    request2FACode: mockRequest2FACode,
  }),
}));

const mockToggleTheme = jest.fn();
jest.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ isDarkMode: false, toggleTheme: mockToggleTheme }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock the TwoFactorAuthModal to render a visible element showing its isOpen prop
jest.mock('../components/modals/TwoFactorAuthModal', () => (props: any) => {
  return (
    <div data-testid="two-factor-mock">
      {props.isOpen ? '2FA OPEN' : '2FA CLOSED'}
    </div>
  );
});

// Mock lucide-react icons used by the component to simple spans
jest.mock('lucide-react', () => ({
  Shield: (p: any) => <span data-testid="icon-shield" {...p} />, 
  UsersRound: (p: any) => <span data-testid="icon-users" {...p} />, 
  CloudRain: (p: any) => <span data-testid="icon-cloud" {...p} />, 
  LogIn: (p: any) => <span data-testid="icon-login" {...p} />, 
  Lock: (p: any) => <span data-testid="icon-lock" {...p} />, 
  Mail: (p: any) => <span data-testid="icon-mail" {...p} />, 
  User: (p: any) => <span data-testid="icon-user" {...p} />, 
  ArrowLeft: (p: any) => <span data-testid="icon-arrow" {...p} />, 
  Moon: (p: any) => <span data-testid="icon-moon" {...p} />, 
  Sun: (p: any) => <span data-testid="icon-sun" {...p} />,
}));

// Now import the component under test
import Login from '../components/login/Login';

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows 2FA modal when login response requires 2FA', async () => {
    // mock login to return an object indicating 2FA is required
    mockLogin.mockResolvedValueOnce({ sessionToken: 'token-123', requires2FA: true });

    render(<Login />);

    // fill fields and submit
    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/•+/i);
    const submitBtn = screen.getByRole('button', { name: /Entrar no Sistema/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    userEvent.click(submitBtn);

    // wait for login to be called and for modal to show
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123'));

    const twoFactor = await screen.findByTestId('two-factor-mock');
    expect(twoFactor).toHaveTextContent('2FA OPEN');
  });

  it('calls login when submitting valid credentials (no 2FA)', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/•+/i);
    const submitBtn = screen.getByRole('button', { name: /Entrar no Sistema/i });

    await userEvent.type(emailInput, 'no2fa@example.com');
    await userEvent.type(passwordInput, 'pwd');
    userEvent.click(submitBtn);

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('no2fa@example.com', 'pwd'));
    // since navigation is handled by AuthContext in real app, we just assert login was called
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
