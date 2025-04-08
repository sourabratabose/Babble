// Signup.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "./Signup";

test("shows error toast when all fields are empty on submit", () => {
  const { getByText, getByRole } = render(<Signup />);

  const submitButton = getByRole("button", { name: /Sign Up/i });
  fireEvent.click(submitButton);

  expect(getByText(/Please Fill all the Feilds/i)).toBeInTheDocument();
});

test("shows error toast when passwords do not match", async () => {
  const { getByText, getByLabelText } = render(<Signup />);

  const nameInput = getByLabelText(/Name/i);
  const emailInput = getByLabelText(/Email Address/i);
  const passwordInput = getByLabelText(/Password/i);
  const confirmPasswordInput = getByLabelText(/Confirm Password/i);
  const submitButton = getByRole("button", { name: /Sign Up/i });

  await userEvent.type(nameInput, "John Doe");
  await userEvent.type(emailInput, "johndoe@example.com");
  await userEvent.type(passwordInput, "password123");
  await userEvent.type(confirmPasswordInput, "wrongpassword");

  fireEvent.click(submitButton);

  expect(getByText(/Passwords Do Not Match/i)).toBeInTheDocument();
});

jest.mock("axios"); // Mock axios for image upload

test("shows error toast when no image is selected", () => {
  const { getByText, getByLabelText } = render(<Signup />);

  const fileInput = getByLabelText(/Upload your Picture/i);
  const submitButton = getByRole("button", { name: /Sign Up/i });

  fireEvent.click(submitButton);

  expect(getByText(/Please Select an Image!/i)).toBeInTheDocument();
});

// Mock function for image upload success (implementation details omitted)
const mockUploadImage = jest.fn((image) =>
  Promise.resolve({ url: "https://example.com/image.jpg" })
);

test("calls mock upload function and sets pic state on successful image upload", async () => {
  const { getByLabelText } = render(<Signup uploadImage={mockUploadImage} />);

  const fileInput = getByLabelText(/Upload your Picture/i);
  const imageFile = new File(["image data"], "test.jpg", {
    type: "image/jpeg",
  });

  await userEvent.upload(fileInput, imageFile);

  expect(mockUploadImage).toHaveBeenCalledWith(imageFile);
  // You can also assert the pic state value here
});

test("sets button loading state on submit", () => {
  const { getByRole } = render(<Signup />);

  const submitButton = getByRole("button", { name: /Sign Up/i });

  fireEvent.click(submitButton);

  expect(submitButton).toHaveAttribute("isLoading");
});

test("clears button loading state after successful submit (mock required)", async () => {
  const { getByRole } = render(
    <Signup onSubmit={jest.fn().mockResolvedValue()} />
  ); // Mock successful submit

  const submitButton = getByRole("button", { name: /Sign Up/i });

  fireEvent.click(submitButton);

  // Wait for submit mock to resolve
  await new Promise((resolve) => setTimeout(resolve, 10));

  expect(submitButton).not.toHaveAttribute("isLoading");
});