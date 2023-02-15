import express, { Request, Response } from 'express'
import { TLoginRequest, TSignupRequest, UserDB } from "../types";
import { GetUserInputDTO, UserDTO } from "../dto/UserDTO";
import { UserBusiness } from "../business/UserBusiness";
import { BaseError } from '../erros/BaseError';

export class UserController {
    constructor(
        private userDTO: UserDTO,
        private userBusiness: UserBusiness
    ) { }

    public getUsers = async (req: Request, res: Response) => {
        try {
            const request: GetUserInputDTO= {
                q: req.query.q as string,
                token:req.headers.authorization 
            }
            const input = this.userDTO.getUserInput(request.q, request.token)
            const output = await this.userBusiness.getUsers(input)
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


    public signUp = async (req: Request, res: Response) => {
        try {
            const request = req.body as TSignupRequest
            const input = this.userDTO.signupUserInput(request.name, request.email, request.password)
            const output = await this.userBusiness.signUp(input)
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


    public login = async (req: Request, res: Response) => {
        try {
            const request = req.body as TLoginRequest
            const input = this.userDTO.loginUserInput(request.email, request.password)
            const output = await this.userBusiness.login(input)
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