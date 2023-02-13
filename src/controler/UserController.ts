import express, { Request, Response } from 'express'
import { TLoginRequest, TSignupRequest, UserDB } from "../types";
import { UserDTO } from "../dto/UserDTO";
import { UserBusiness } from "../business/UserBusiness";

export class UserController {
    constructor(
        private userDTO: UserDTO,
        private userBusiness: UserBusiness
    ) { }

    public getUsers = async (req: Request, res: Response) => {
        try {
            const request = {
                q: req.query.q
            }
            const input = this.userDTO.getUserInput(request.q)
            const output = await this.userBusiness.getUsers(input)
            res.status(200).send(output)
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


    public signUp = async (req: Request, res: Response) => {
        try {
            const request = req.body as TSignupRequest
            const input = this.userDTO.signupUserInput(request.name, request.email, request.password)
            const output = await this.userBusiness.signUp(input)
            res.status(201).send(output)
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


    public login = async (req: Request, res: Response) => {
        try {
            const request = req.body as TLoginRequest
            const input = this.userDTO.loginUserInput(request.email, request.password)
            const output = await this.userBusiness.login(input)
            res.status(200).send(output)
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