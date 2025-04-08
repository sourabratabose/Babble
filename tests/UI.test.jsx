import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chatbox from './Chatbox';
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

// Mocking the ChatState context
jest.mock('../Context/ChatProvider', () => ({
  ChatState: jest.fn(),
}));

// Mocking the SingleChat component
jest.mock('./SingleChat', () => jest.fn(() => <div data-testid="single-chat-component">Single Chat Component</div>));

describe('Chatbox Component', () => {
  const mockFetchAgain = jest.fn();
  const mockSetFetchAgain = jest.fn();

  beforeEach(() => {
    ChatState.mockReturnValue({ selectedChat: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Chatbox component with SingleChat when selectedChat is true', () => {
    render(<Chatbox fetchAgain={mockFetchAgain} setFetchAgain={mockSetFetchAgain} />);
    
    const chatBox = screen.getByTestId('chatbox-container');
    expect(chatBox).toBeInTheDocument();
    expect(chatBox).toHaveStyle('display: flex');  // Should be visible when selectedChat is true
    expect(screen.getByTestId('single-chat-component')).toBeInTheDocument();
  });

  test('does not display Chatbox on mobile view when selectedChat is false', () => {
    ChatState.mockReturnValue({ selectedChat: false });
    
    render(<Chatbox fetchAgain={mockFetchAgain} setFetchAgain={mockSetFetchAgain} />);
    
    const chatBox = screen.queryByTestId('chatbox-container');
    expect(chatBox).not.toBeInTheDocument();  // Should not render in base view if selectedChat is false
  });

  test('renders with correct styles', () => {
    render(<Chatbox fetchAgain={mockFetchAgain} setFetchAgain={mockSetFetchAgain} />);

    const chatBox = screen.getByTestId('chatbox-container');
    expect(chatBox).toHaveStyle('align-items: center');
    expect(chatBox).toHaveStyle('background-color: white');
    expect(chatBox).toHaveStyle('border-radius: lg');
    expect(chatBox).toHaveStyle('border-width: 1px');
  });
});
