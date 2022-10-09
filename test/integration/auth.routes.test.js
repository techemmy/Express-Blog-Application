const supertest = require("supertest");
const app = require("../../app")
const mongoose = require("mongoose")

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  }

beforeAll(async () => {
    console.log("Before all tests")
    await mongoose.connect(process.env.testdbURI)
})

afterAll(async () => {
    console.log("After all tests")
    await removeAllCollections();
    await mongoose.connection.close()
})

describe("Authentication Register", () => {
    it("should GET /auth/register", async () => {
        const response = await supertest(app).get("/auth/register");
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/register due to short username", async () => {
        const userAuthData = {
            username: "testuser",
            email: "test?",
            password: "testuser",
            confirmPassword: "testuser"
        }

        const response = await supertest(app).post("/auth/register").send(userAuthData);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/register due to invalid email", async () => {
        const userAuthData = {
            username: "testuser",
            email: "test?",
            password: "testuser",
            confirmPassword: "testuser"
        }

        const response = await supertest(app).post("/auth/register").send(userAuthData);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/register due to short password", async () => {
        const userAuthData = {
            username: "testuser",
            email: "testuser@test.com",
            password: "test",
            confirmPassword: "test"
        }

        const response = await supertest(app).post("/auth/register").send(userAuthData);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/register due to password and confirm password mismatch", async () => {
        const userAuthData = {
            username: "testuser",
            email: "testuser@test.com",
            password: "testnouser",
            confirmPassword: "testuser"
        }

        const response = await supertest(app).post("/auth/register").send(userAuthData);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should POST /auth/register successfully ", async () => {
        const userAuthData = {
            username: "testuser",
            email: "testuser@test.com",
            password: "testuser",
            confirmPassword: "testuser"
        }

        const response = await supertest(app).post("/auth/register").send(userAuthData);
        expect(response.statusCode).toBe(302);
        expect(response.headers['content-type']).toContain("text/plain")
    })

    it("should fail to POST /auth/register because user already exists ", async () => {
        const userAuthData = {
            username: "testuser",
            email: "testuser@test.com",
            password: "testuser",
            confirmPassword: "testuser"
        }

        const response = await supertest(app).post("/auth/register").send(userAuthData);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })
})