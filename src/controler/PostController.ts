import express, { Request, Response } from 'express'
import {
    TPostRequest,
} from "../types"
import { PostDTO } from "../dto/PostDTO";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from '../erros/BaseError';

export class PostContoller {
    constructor(
        private postDTO: PostDTO,
        private postBusiness: PostBusiness
    ) { }


    public getPosts = async (req: Request, res: Response) => {
        try {
            const request = {
                q: req.query.q
            }
            const input = this.postDTO.getPostInput(request.q)
            const output = await this.postBusiness.getPosts(input)
            res.status(200).send(output)
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
    }


    public createPost = async (req: Request, res: Response) => {
        try {
            const request = req.body as TPostRequest
            const user = req.headers['user-id'] as string
            const input = this.postDTO.createPostInput(request.content, user)
            const output = await this.postBusiness.createPost(input)
            res.status(201).send(output)
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
    }


    public editPostById = async (req: Request, res: Response) => {
        try {
            const input = this.postDTO.editPostInput(
                req.headers['user-id'] as string,
                req.params['id'],
                req.body.content
            )
            const output = await this.postBusiness.editPostById(input)
            res.status(200).send(output)
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
    }

    public deletPostById = async (req: Request, res: Response) => {
        try {
            const input = this.postDTO.deletePostInput(
                req.headers['user-id'] as string,
                req.params['id']
            )
            const output = await this.postBusiness.deletPostById(input)
            console.log(input)
            res.status(200).send(output)
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
    }


    public likeDislike = async (req: Request, res: Response) => {

        try {
            /*
            const user = req.headers['user-id'] as string
            const { id } = req.params
            const newLike = req.body.like
            */
            const input = {
                id: req.params.id,
                newLike: req.body.like,
                user: req.headers['user-id'] as string
            }
            const output = await this.postBusiness.likeDislike(input)
            res.status(200).send(output)


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
    }

}