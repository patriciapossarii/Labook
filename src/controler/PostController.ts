
import { PostDatabase } from "../database/PostDatabase"
import express, { Request, Response } from 'express'
import { Post } from "../models/Post"
import {
    TPostDB, PostWithUser, TUserPost, TUserPostDB,
    TUserDB
} from "../types"
export class PostContoller {

    public getPosts = async (req: Request, res: Response) => {
        try {
           
            const postDatabase = new PostDatabase()
            const result: PostWithUser[] = []

            const posts = await postDatabase.postUser()

            for (let post of posts) {

                let postWithUser: PostWithUser = {
                    id: post.id,
                    content: post.content,
                    likes: post.likes,
                    dislikes: post.dislikes,
                    createdAt: post.createdAt,
                    updatedAt: post.updateAt,
                    creator: {
                        id: post.uid,
                        name: post.name
                    }
                }

                result.push(postWithUser)
            }

            res.status(200).send(result)


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
    }





}