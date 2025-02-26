const request = require("supertest");
const app = require("../src/server");
const mongoose = require("mongoose");
const Task = require("../src/models/Task");

let token;

beforeAll(async () => {
  await request(app).post("/api/auth/register").send({
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "password123",
  });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Task Routes", () => {
  test("Create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", token)
      .send({ title: "Test Task", description: "Test Description" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });

  test("Get all tasks", async () => {
    const res = await request(app).get("/api/tasks").set("Authorization", token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
