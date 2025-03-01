const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../src/server");
const Task = require("../src/models/Task");
const User = require("../src/models/User");

let mongoServer;
let token;
let userId;
process.env.JWT_SECRET = 'test-jwt-secret'; 

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const user = new User({
    username: "testuser",
    email: "test@example.com",
    password: "$2a$10$hashedpassword",
  });
  await user.save();
  userId = user._id;

  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe("Task Routes", () => {
  test("Create a task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Task",
        description: "Test Description",
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("New Task");
  });

  test("Get all tasks for a user", async () => {
    await Task.create({ title: "Task 1", userId });
    await Task.create({ title: "Task 2", userId });

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Update a task", async () => {
    const task = await Task.create({ title: "Task to Update", userId });

    const response = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Task" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Task");
  });

  test("Delete a task", async () => {
    const task = await Task.create({ title: "Task to Delete", userId });

    const response = await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted");
  });
});
