import express, { Request, Response } from 'express'
import {
    TPostRequest,
} from "../types"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, LikeDislikeInputDTO, PostDTO } from "../dto/PostDTO";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from '../erros/BaseError';

export class PostContoller {
    constructor(
        private postDTO: PostDTO,
        private postBusiness: PostBusiness
    ) { }


    public getPosts = async (req: Request, res: Response) => {
        try {
            const request: GetPostsInputDTO = {
                q: req.query.q as string,
                token: req.headers.authorization
            }
            const input = this.postDTO.getPostInput(request.q, request.token as string)
            const output = await this.postBusiness.getPosts(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public createPost = async (req: Request, res: Response) => {
        try {
            const request = req.body as TPostRequest
            const input: CreatePostInputDTO = this.postDTO.createPostInput(
                request.content,
                req.headers.authorization as string)
            const output = await this.postBusiness.createPost(input)
            res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public editPostById = async (req: Request, res: Response) => {
        try {
            const input: EditPostInputDTO = this.postDTO.editPostInput(
                req.headers.authorization as string,
                req.params['id'],
                req.body.content
            )
            const output = await this.postBusiness.editPostById(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public deletPostById = async (req: Request, res: Response) => {
        try {
            const input: DeletePostInputDTO = this.postDTO.deletePostInput(
                req.headers.authorization as string,
                req.params['id']
            )
            const output = await this.postBusiness.deletPostById(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public likeDislike = async (req: Request, res: Response) => {
        try {
            const input: LikeDislikeInputDTO = {
                postId: req.params.id,
                newLikeDislike: req.body.like,
                token: req.headers.authorization
            }
            const output = await this.postBusiness.likeDislike(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

}