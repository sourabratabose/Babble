// MyChats.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MyChats from "./MyChats";

const mockChats = [
  {
    _id: "1",
    chatName: "Chat 1",
    latestMessage: { sender: { name: "John" }, content: "Hi there!" },
  },
  { _id: "2", chatName: "Chat 2", latestMessage: null },
];

const mockChatState = {
  selectedChat: null,
  setSelectedChat: jest.fn(),
  user: { token: "abc" },
  chats: mockChats,
  setChats: jest.fn(),
};

test("renders MyChats component with chats", () => {
  render(<MyChats {...mockChatState} />);

  const chatsContainer = screen.getByTestId("chats-container"); // Add a data-testid attribute for easier selection

  expect(chatsContainer).toBeInTheDocument();
  expect(screen.getByText("My Chats")).toBeInTheDocument();

  // Test chat list rendering
  const chatItems = screen.getAllByRole("button"); // Since each chat is rendered as a clickable button
  expect(chatItems.length).toBe(2);

  // Test selecting a chat
  fireEvent.click(chatItems[0]);
  expect(mockChatState.setSelectedChat).toHaveBeenCalledWith(mockChats[0]);
});

test("renders MyChats component with loading indicator", () => {
  render(<MyChats {...mockChatState} chats={null} />); // Set chats to null to trigger loading

  expect(screen.getByTestId("chats-container")).toBeInTheDocument();
  expect(screen.getByText("My Chats")).toBeInTheDocument();
  expect(screen.getByTestId("chat-loading")).toBeInTheDocument(); // Add a data-testid for loading indicator
});
