const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");
const testUser = { username: "testing", password: "testing" };

describe("server.js", () => {
  describe("Get Request for jokes", () => {
    it("should return status 400 when not logged in", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(400);
    });

    it("Should return json", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.type).toBe("application/json");
    });
    describe("reistering new user", () => {
      it("should return with status code of 201 when adding new user", async () => {
        await db("users").truncate();
        const res = await request(server)
          .post("/api/auth/register")
          .send(testUser);
        expect(res.status).toBe(201);
      });

      it("shoudld return a status of 500 with an existing user", async () => {
        const res = await request(server)
          .post("/api/auth/register")
          .send(testUser);
        expect(res.status).toBe(500);
      });
    });

    describe("login with user", () => {
      it("should return a status code of 200 with test user", async () => {
        const res = await request(server)
          .post("/api/auth/login")
          .send(testUser);
        expect(res.status).toBe(200);
      });

      it("should return a status of 500 for invalid user", async () => {
        const res = await request(server)
          .post("/api/auth/login")
          .send({ username: "blahblah", password: "blah blah" });
        expect(res.status).toBe(500);
      });
    });
  });
});
