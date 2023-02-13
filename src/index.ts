import express, { Request, Response } from 'express'
import cors from 'cors'
import { UserController } from './controler/UserController'
import { PostContoller } from './controler/PostController'
import { postRouter } from './routers/postRouter'
import { userRouter } from './routers/userRouter'


const app = express()

app.use(cors())
app.use(express.json())
/*
const userController = new UserController()
const postController = new PostContoller()
*/
app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
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
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.use("/posts",postRouter)
app.use("/users",userRouter)
/*
app.get("/users", userController.getUsers)
app.post("/users/signup",userController.signUp)
app.post("/users/login",userController.login)
*/

/*
app.get("/posts",postController.getPosts) --ok
app.post("/posts",postController.createPost) --ok
app.put("/posts/:id",postController.editPostById)--ok
app.delete("/posts/:id",postController.deletPostById) --ok
app.put("/posts/:id/like",postController.likeDislike) ---ok---obs
*/
