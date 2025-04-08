import { render, screen } from "@testing-library/react";
import Chatbox from "./Chatbox";

jest.mock("./SingleChat", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="single-chat" />),
}));

describe("Chatbox component", () => {
  it("renders the SingleChat component when selectedChat is present", () => {
    const mockChatState = {
      selectedChat: { _id: "123" },
    };

    render(<Chatbox {...mockChatState} />);

    const singleChat = screen.getByTestId("single-chat");
    expect(singleChat).toBeInTheDocument();
  });

  it("does not render the SingleChat component when selectedChat is not present", () => {
    const mockChatState = {
      selectedChat: null,
    };

    render(<Chatbox {...mockChatState} />);

    const singleChat = screen.queryByTestId("single-chat");
    expect(singleChat).not.toBeInTheDocument();
  });
});
