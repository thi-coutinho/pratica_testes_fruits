import supertest from "supertest";
import app from "index";
import fruits from "data/fruits";
import httpStatus from "http-status";

const server = supertest(app)


beforeEach(() => {
    fruits.forEach(e => fruits.pop())
})

describe('POST /fruits', () => {
    it("should respond with status 422 when fruit is missing params", async () => {
        const fakeFruit = { name: "Abacate" }
        const response = await server.post("/fruits").send(fakeFruit)

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
        expect(fruits.length).toBe(0)

    })
    it("should respond with status 422 when fruit has params with type error", async () => {
        const fakeFruit = { name: 78, price: "10 reais" }
        const response = await server.post("/fruits").send(fakeFruit)

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
        expect(fruits.length).toBe(0)

    })

    it("should respond with status 201 when fruit has params with type error", async () => {
        const fakeFruit = { name: "abacate", price: 10 }
        const response = await server.post("/fruits").send(fakeFruit)

        expect(response.status).toBe(httpStatus.CREATED)
        expect(fruits.length).toBe(1)
        expect(fruits[0]).toMatchObject(fakeFruit)

    })
})

describe('GET /fruits', () => {
    it('Should respond with status 200 and empty array if no fruit was created', async () => {
        const response = await server.get("/fruits")

        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual([])

    })

    it('Should respond with status 200 and array with one fruit', async () => {
        const fakeFruit = { name: "abacate", price: 10 }
        await server.post("/fruits").send(fakeFruit)

        const response = await server.get("/fruits")

        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual([fruits[0]])

    })
    it('Should respond with status 200 and array with two fruits', async () => {
        const fakeFruit = { name: "abacate", price: 10 }
        const fakeFruit2 = { name: "laranja", price: 8 }
        await server.post("/fruits").send(fakeFruit)
        await server.post("/fruits").send(fakeFruit2)

        const response = await server.get("/fruits")

        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual([fruits[0],fruits[1]])
        expect(fruits.length).toBe(2)

    })
})

describe('GET /fruits/:id', () => {
    it('Should respond with status 404 and msg: Not Found, when no id is found', async () => {
        const response = await server.get("/fruits/100")

        expect(response.status).toBe(httpStatus.NOT_FOUND)
        expect(response.text).toBe("Not Found")

    })

    it('Should respond with status 200 and obj fruit', async () => {
        const fakeFruit = { name: "abacate", price: 10 }
        await server.post("/fruits").send(fakeFruit)

        const response = await server.get("/fruits/1")

        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual(fruits[0])

    })
})
