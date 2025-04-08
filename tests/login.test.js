import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

jest.mock('axios');
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: jest.fn(),
}));
jest.mock('../../Context/ChatProvider', () => ({
  ChatState: jest.fn(),
}));

describe('Login Component', () => {
  const setUser = jest.fn();
  const toast = jest.fn();
  const history = createMemoryHistory();

  beforeEach(() => {
    ChatState.mockReturnValue({ setUser });
    useToast.mockReturnValue(toast);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(<Router history={history}>{component}</Router>);
  };

  test('renders Login component with all elements', () => {
    renderWithRouter(<Login />);

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Get Guest User Credentials')).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    renderWithRouter(<Login />);

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByText('Show');

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton.textContent).toBe('Hide');

    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton.textContent).toBe('Show');
  });

  test('fills guest credentials on "Get Guest User Credentials" button click', () => {
    renderWithRouter(<Login />);

    const guestButton = screen.getByText('Get Guest User Credentials');
    fireEvent.click(guestButton);

    expect(screen.getByLabelText('Email Address')).toHaveValue('guest@example.com');
    expect(screen.getByLabelText('Password')).toHaveValue('123456');
  });

  test('shows warning toast if fields are empty on login', async () => {
    renderWithRouter(<Login />);

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(toast).toHaveBeenCalledWith({
      title: 'Please Fill all the Feilds',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    });
  });

  test('submits login form successfully', async () => {
    axios.post.mockResolvedValue({
      data: { name: 'Test User', email: 'test@example.com' },
    });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/user/login',
        { email: 'test@example.com', password: 'password123' },
        { headers: { 'Content-type': 'application/json' } }
      );
      expect(toast).toHaveBeenCalledWith({
        title: 'Login Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      expect(setUser).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com' });
      expect(localStorage.setItem).toHaveBeenCalledWith('userInfo', JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
      expect(history.location.pathname).toBe('/chats');
    });
  });

  test('shows error toast if login fails', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error Occured!',
        description: 'Invalid credentials',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    });
  });
});
