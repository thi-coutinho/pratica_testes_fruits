import supertest from "supertest";
import app from "index";

const server = supertest(app)


describe('Health test', () => {
    it("should respond with status 200 msg: I'm alive", async () => {
        const response = await server.get("/health")

        expect(response.status).toBe(200)
        expect(response.text).toBe("I'am alive!")
    })
})