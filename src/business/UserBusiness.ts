import { UserDatabase } from "../database/UserDatabase";
import { UserDTO } from "../dto/UserDTO";
import { User } from "../models/User";
import { TLoginRequest, TSignupRequest, UserDB } from "../types";
import { v4 as uuidv4 } from 'uuid';



export class UserBusiness {
    constructor(
        private userDTO: UserDTO,
        private userDatabase: UserDatabase
    ) { }


    public getUsers = async (input: any) => {
        const { q } = input
        const teste = await this.userDatabase.findUsers(q)
        const users: User[] = teste.map((userDB) => new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        ))
        return users
    }

    public signUp = async (request: TSignupRequest) => {


        if (request.name !== undefined) {
            if (typeof request.name !== "string") {

                throw new Error("name' do usuário deve ser string.")
            }
            if (request.name.length < 2) {

                throw new Error("'name' do usuário inválido. Deve conter no mínimo 2 caracteres")
            }
        } else {

            throw new Error("'name' do usuário deve ser informado.")
        }

        if (request.email !== undefined) {
            const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            if (expression.test(request.email) != true) {

                throw new Error("'email'do usuário em formato inválido. Ex.: 'exemplo@exemplo.com'.")
            }
            const emailExists = await this.userDatabase.checkEmailUserExist(request.email)
            if (emailExists.length >= 1) {

                throw new Error("'email' do usuário já existente.")
            }
        } else {

            throw new Error("'email' do usuário deve ser informado.")
        }

        if (request.password !== undefined) {
            if (!request.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,12}$/g)) {

                throw new Error("'password' do usuário em formato inválido. Deve conter entre 4 a 12 caracteres, com 1 letra maiuscula, 1 letra minúscula, 1 número.")
            }
        } else {

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
        await this.userDatabase.insertUser(newUserDB)
        const output = {
            message: "Cadastro realizado com sucesso",
            result: newUser
        }
        return output
    }

    public login = async (request: TLoginRequest) => {
        if (request.email !== undefined) {
            const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            if (expression.test(request.email) != true) {

                throw new Error("'email'do usuário em formato inválido. Ex.: 'exemplo@exemplo.com'.")
            }
        } else {

            throw new Error("'email' do usuário deve ser informado.")
        }

        if (request.password !== undefined) {
            if (!request.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,12}$/g)) {

                throw new Error("'password' do usuário em formato inválido. Deve conter entre 4 a 12 caracteres, com 1 letra maiuscula, 1 letra minúscula, 1 número.")
            }
        } else {

            throw new Error("'password' do usuário deve ser informado.")
        }

        let checkLog = await this.userDatabase.checkLogin(request.email, request.password)

        if (checkLog.length > 0) {
            const output = {
                message: "Login realizado com sucesso"
            }
            return output
        } else {
            const output = {
                message: "Email ou senha inválido"
            }
            return output
        }
    }




}