const request = require("supertest");
const app = require("./server"); // Assuming server.js is your main entry point

describe("User signup endpoint", () => {
  test("should create a new user on successful signup", async () => {
    const newUser = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/user")
      .send(newUser)
      .expect(201); // Expecting a created (201) response

    expect(response.body).toHaveProperty("_id"); // Check for user ID in response
  });
});

test("should access a chat", async () => {
  // Mock authenticated user
  const mockUser = { _id: "user123" };

  const response = await request(app)
    .post("/api/chat")
    .set("Authorization", `Bearer ${mockToken}`) // Set authorization header
    .send({ userId: "user456" })
    .expect(200);

  expect(response.body).toHaveProperty("chatId");
});

test("should fetch user chats", async () => {
  const mockUser = { _id: "user123" };
  const mockChats = [{ chatId: "chat123" }, { chatId: "chat456" }];

  jest.spyOn(ChatModel, "find").mockResolvedValue(mockChats);

  const response = await request(app)
    .get("/api/chat")
    .set("Authorization", `Bearer ${mockToken}`)
    .expect(200);

  expect(response.body).toEqual(mockChats);
});

test("should rename a group chat", async () => {
  const mockUser = { _id: "user123" };
  const mockChatId = "chat123";
  const newGroupName = "New Group Name";

  const response = await request(app)
    .put("/api/rename")
    .set("Authorization", `Bearer ${mockToken}`)
    .send({ chatId: mockChatId, name: newGroupName })
    .expect(200);

  expect(response.body.message).toBe("Group renamed successfully");
});