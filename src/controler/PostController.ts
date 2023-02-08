
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
import moment, { Moment } from 'moment'
import { UserDatabase } from "../database/UserDatabase";
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

    public editPostById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const newContent = req.body.content

            const postDatabase = new PostDatabase()
            if (newContent !== undefined) {
                if (typeof newContent !== "string") {
                    res.status(400)
                    throw new Error("'content' do post deve ser string.")
                }
                if (newContent.length < 2) {
                    res.status(400)
                    throw new Error("'content' do post inválido. Deve conter no mínimo 2 caracteres")
                }
            }
            const postToEditDB = await postDatabase.findPostById(id)
            if (!postToEditDB) {
                throw new Error("'id' para editar não existe")
            }
            var date = Date.now()
            let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')
            console.log(postToEditDB)
            const post = new Post(
                postToEditDB.id,
                postToEditDB.creator_id,
                newContent || postToEditDB.content,
                postToEditDB.likes,
                postToEditDB.dislikes,
                postToEditDB.created_at,
                dateNow
            )



            const updatePostDB: PostDB = {
                id: post.getId(),
                creator_id: post.getCreatorId(),
                content: post.getContent(),
                likes: post.getLikes(),
                dislikes: post.getDislikes(),
                created_at: post.getCreatedAt(),
                updated_at: post.getUpdatedAt()
            }

            await postDatabase.updatePost(updatePostDB)
            res.status(200).send({
                message: "Post editado com sucesso",
                result: updatePostDB
            })


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

    public deletPostById = async (req: Request, res: Response) => {
        try {
            const idToDelete = req.params.id
            console.log(idToDelete)
            const postDatabase = new PostDatabase()
            const postToDeletBD = await postDatabase.findPostById(idToDelete)

            if (!postToDeletBD) {
                throw new Error("'id' para deletar não existe")
            }

            await postDatabase.deletePostById(postToDeletBD.id)

            res.status(200).send({
                message: "Post deletado com sucesso"
            })

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

    public likeDislike = async (req: Request, res: Response) => {

        try {
            const user = req.headers['user-id'] as string
            const { id } = req.params
            const newLike = req.body.like

            const postDatabase = new PostDatabase()
            const userDatabase = new UserDatabase()

            const userExistDB = await userDatabase.findUserById(user)
            if (!userExistDB) {
                throw new Error("'id' do usuário não existe")
            }


            const postExistDB = await postDatabase.findPostById(id)
            if (!postExistDB) {
                throw new Error("'id' do post não existe")
            }




            if (newLike !== undefined) {
                if (typeof newLike !== "boolean") {
                    res.status(400)
                    throw new Error("'like' do post deve ser boolean (true ou false).")
                }
            }

            let likeBD = 0
            if (newLike === true) {
                likeBD = 1
            } 
            
            const checkLikePost = await postDatabase.checkPostWithLike(user, id, likeBD)
            console.log(checkLikePost)


            const post = new Post(
                postExistDB.id,
                postExistDB.creator_id,
                postExistDB.content,
                postExistDB.likes || newLike,
                postExistDB.dislikes,
                postExistDB.created_at,
                postExistDB.updated_at
            )



            const updatePostDB: PostDB = {
                id: post.getId(),
                creator_id: post.getCreatorId(),
                content: post.getContent(),
                likes: post.getLikes(),
                dislikes: post.getDislikes(),
                created_at: post.getCreatedAt(),
                updated_at: post.getUpdatedAt()
            }

            await postDatabase.updatePost(updatePostDB)
            res.status(200).send({
                message: "Post editado com sucesso",
                result: checkLikePost
            })


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