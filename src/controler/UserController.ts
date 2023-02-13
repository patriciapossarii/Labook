import { User } from "../models/User";
import { UserDatabase } from "../database/UserDatabase";
import express, { Request, Response } from 'express'
import { TLoginRequest, TSignupRequest, UserDB } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { UserDTO } from "../dto/UserDTO";
import { UserBusiness } from "../business/UserBusiness";

export class UserController {
    constructor(
        private userDTO: UserDTO,
        private userBusiness: UserBusiness
    ) { }

    public getUsers = async (req: Request, res: Response) => {
        try {
            const input = {
                q: req.query.q
            }
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

            const output = await this.userBusiness.signUp(request)

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