
import { PostDatabase } from "../database/PostDatabase"
import express, { Request, Response } from 'express'
import { Post } from "../models/Post"
import {
    TPostDB, PostWithUser, TUserPost, TUserPostDB,
    TUserDB,
    TPostRequest,
    PostDB
} from "../types"
import { v4 as uuidv4 } from 'uuid';
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


    public createPost = async (req: Request, res: Response) => {
        try {
            const request = req.body as TPostRequest
            const postDatabase = new PostDatabase()

            if (request.content !== undefined) {
                if (typeof request.content !== "string") {
                    res.status(400)
                    throw new Error("'content' do post deve ser string.")
                }
                if (request.content.length < 2) {
                    res.status(400)
                    throw new Error("'content' do post inválido. Deve conter no mínimo 2 caracteres")
                }
            } else {
                res.status(400)
                throw new Error("'content' do post deve ser informado.")
            }

            let myuuid = uuidv4()
            const userMocado = "user01"

            const newPost = new Post(
                myuuid,
                userMocado,
                request.content,
            )

            const newPostDB: PostDB = {
                id: newPost.getId(),
                creator_id: newPost.getCreatorId(),
                content: newPost.getContent(),
                likes: newPost.getLikes(),
                dislikes: newPost.getDislikes(),
                created_at: newPost.getCreatedAt(),
                updated_at: newPost.getUpdatedAt()
            }
            await postDatabase.insertPost(newPostDB)
            res.status(201).send("Post criado com sucesso")
            
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