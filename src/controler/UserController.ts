import { User } from "../models/User";
import { UserDatabase } from "../database/UserDatabase";
import express, { Request, Response } from 'express'
import { TLoginRequest, TSignupRequest, UserDB } from "../types";
import { v4 as uuidv4 } from 'uuid';

export class UserController {

    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined

            const userDatabase = new UserDatabase()
            const teste = await userDatabase.findUsers(q)

            const users: User[] = teste.map((userDB) => new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            ))

            res.status(200).send(users)
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

            const userDatabase = new UserDatabase()

            if (request.name !== undefined) {
                if (typeof request.name !== "string") {
                    res.status(400)
                    throw new Error("name' do usuário deve ser string.")
                }
                if (request.name.length < 2) {
                    res.status(400)
                    throw new Error("'name' do usuário inválido. Deve conter no mínimo 2 caracteres")
                }
            } else {
                res.status(400)
                throw new Error("'name' do usuário deve ser informado.")
            }

            if (request.email !== undefined) {
                const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                if (expression.test(request.email) != true) {
                    res.status(400)
                    throw new Error("'email'do usuário em formato inválido. Ex.: 'exemplo@exemplo.com'.")
                }
                const emailExists = await userDatabase.checkEmailUserExist(request.email)
                if (emailExists.length >= 1) {
                    res.status(400)
                    throw new Error("'email' do usuário já existente.")
                }
            } else {
                res.status(400)
                throw new Error("'email' do usuário deve ser informado.")
            }

            if (request.password !== undefined) {
                if (!request.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,12}$/g)) {
                    res.status(400)
                    throw new Error("'password' do usuário em formato inválido. Deve conter entre 4 a 12 caracteres, com 1 letra maiuscula, 1 letra minúscula, 1 número.")
                }
            } else {
                res.status(400)
                throw new Error("'password' do usuário deve ser informado.")
            }

            let myuuid = uuidv4();

            const newUser = new User(
                myuuid,
                request.name,
                request.email,
                request.password
            )
            

            const newUserDB: UserDB = {
                id: newUser.getId(),
                name: newUser.getName(),
                email: newUser.getEmail(),
                password: newUser.getPassword(),
                role: newUser.getRole(),
                created_at: newUser.getCreatedAt()
            }
            await userDatabase.insertUser(newUserDB)
            res.status(201).send("Cadastro realizado com sucesso")

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

            const userDatabase = new UserDatabase()
            if (request.email !== undefined) {
                const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                if (expression.test(request.email) != true) {
                    res.status(400)
                    throw new Error("'email'do usuário em formato inválido. Ex.: 'exemplo@exemplo.com'.")
                }
            } else {
                res.status(400)
                throw new Error("'email' do usuário deve ser informado.")
            }


            if (request.password !== undefined) {
                if (!request.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,12}$/g)) {
                    res.status(400)
                    throw new Error("'password' do usuário em formato inválido. Deve conter entre 4 a 12 caracteres, com 1 letra maiuscula, 1 letra minúscula, 1 número.")
                }
            } else {
                res.status(400)
                throw new Error("'password' do usuário deve ser informado.")
            }



            let checkLog = await userDatabase.checkLogin(request.email, request.password)

            if (checkLog.length > 0) {
                res.status(201).send("Login realizado com sucesso")
            } else {
                res.status(201).send("Email ou senha inválido")
            }


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