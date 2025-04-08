const request = require("supertest");
const app = require("./app"); // Assuming your main app file

describe("User Routes", () => {
  it("should register a new user", async () => {
    const newUser = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201); // Expecting a created (201) response

    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("token"); // Check for generated token
  });

  it("should login a user and return a token", async () => {
    const existingUser = {
      email: "johndoe@example.com",
      password: "password123", // Assuming password is already hashed
    };

    // Mock user model lookup to return existing user
    jest.spyOn(UserModel, "findOne").mockResolvedValue(existingUser);

    const response = await request(app)
      .post("/api/login")
      .send(existingUser)
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });

  it("should fetch all users (protected route)", async () => {
    const mockUser = { _id: "user123" }; // Mock authenticated user
    const mockUsers = [{ _id: "user456" }, { _id: "user789" }];

    // Mock database query to return mockUsers
    jest.spyOn(UserModel, "find").mockResolvedValue(mockUsers);

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${mockToken}`) // Set authorization header
      .expect(200);

    expect(response.body).toEqual(mockUsers);
  });

  // Add more test cases for error handling (e.g., invalid email, wrong password)
});
