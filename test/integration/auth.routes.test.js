const supertest = require("supertest");
const app = require("../../app")
const mongoose = require("mongoose")
const {usersForRegistration, usersForLogin} = require("../fixtures/users");

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
        const response = await supertest(app).post("/auth/register").send(usersForRegistration.withShortUsername);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/register due to invalid email address", async () => {
        const response = await supertest(app).post("/auth/register").send(usersForRegistration.withInvalidEmail);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/register due to short password", async () => {
        const response = await supertest(app).post("/auth/register").send(usersForRegistration.withShortPassword);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/register due to password and confirm password mismatch", async () => {
        const response = await supertest(app).post("/auth/register").send(usersForRegistration.withPasswordAndConfirmPasswordFieldMismatched);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should POST /auth/register successfully ", async () => {
        const response = await supertest(app).post("/auth/register").send(usersForRegistration.validUser);
        expect(response.statusCode).toBe(302);
        expect(response.headers['content-type']).toContain("text/plain")
    })

    it("should fail to POST /auth/register because user already exists ", async () => {
        const response = await supertest(app).post("/auth/register").send(usersForRegistration.validUser);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })
})

describe("Authentication Login", () => {
    it("should GET /auth/login", async () => {
        const response = await supertest(app).get("/auth/login");
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/login due to invalid email address", async () => {
        const response = await supertest(app).post("/auth/login").send(usersForLogin.withInvalidEmail);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/login due to short password", async () => {
        const response = await supertest(app).post("/auth/login").send(usersForLogin.withShortPassword);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/login due to incorrect password", async () => {
        const response = await supertest(app).post("/auth/login").send(usersForLogin.withIncorrectPassword);
        expect(response.statusCode).toBe(401);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should fail to POST /auth/login due to unexisting user", async () => {
        const response = await supertest(app).post("/auth/login").send(usersForLogin.withUnexistingUser);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toContain("text/html")
    })

    it("should POST /auth/login successfully ", async () => {
        const response = await supertest(app).post("/auth/login").send(usersForLogin.withValidUser);
        expect(response.statusCode).toBe(302);
        expect(response.headers['content-type']).toContain("text/plain")
    })
})
