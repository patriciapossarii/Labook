import express from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostContoller } from "../controler/PostController"
import { PostDatabase } from "../database/PostDatabase"
import { PostDTO } from "../dto/PostDTO"

export const postRouter = express.Router()

const postController = new PostContoller(
    new PostDTO(),
    new PostBusiness(
        new PostDTO(),
        new PostDatabase()
    )
)

postRouter.get("/",postController.getPosts)
postRouter.post("/",postController.createPost)
postRouter.put("/:id",postController.editPostById)
postRouter.delete("/:id",postController.deletPostById)
postRouter.put(":id/like",postController.likeDislike)
