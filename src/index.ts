import express, { Request, Response } from 'express'
import cors from 'cors'
import { postRouter } from './routers/postRouter'
import { userRouter } from './routers/userRouter'
import { BaseError } from './erros/BaseError'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            const returnError = error as BaseError
            res.status(returnError.statusCode).send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.use("/posts",postRouter)
app.use("/users",userRouter)

