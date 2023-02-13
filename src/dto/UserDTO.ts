import { BadRequestError } from "../erros/BadRequest"
import { User } from "../models/User"


export interface SignupUsertInputDTO {
    name: string,
    email: string,
    password: string
}

export interface SignupUserOutputDTO {
    token: string
}

export interface LoginUserInputDTO {
    email: string,
    password: string,
}

export interface LoginUserOutputDTO {
    token: string
}



export class UserDTO {
    public signupUserInput(
        name: unknown,
        email: unknown,
        password: unknown
    ): SignupUsertInputDTO {

        if (name !== undefined) {
            if (typeof name !== "string") {
                throw new BadRequestError("name' do usuário deve ser string.")
            }
        } else {
            throw new BadRequestError("'name' do usuário deve ser informado.")
        }

        if (email !== undefined) {
            if (typeof email !== "string") {
                throw new BadRequestError("email' do usuário deve ser string.")
            }
        } else {
            throw new BadRequestError("'email' do usuário deve ser informado.")
        }


        if (password !== undefined) {
            if (typeof password !== "string") {
                throw new BadRequestError("password' do usuário deve ser string.")
            }
        } else {
            throw new BadRequestError("'password' do usuário deve ser informado.")
        }


        const dto: SignupUsertInputDTO = {
            name,
            email,
            password
        }
        return dto
    }

    public signupUserOutout(token:string): SignupUserOutputDTO {
        const dto: SignupUserOutputDTO = {
            token: token
        }
        return dto
    }

    public loginUserInput(
        email: unknown,
        password: unknown
    ): LoginUserInputDTO {
        if (email !== undefined) {
            if (typeof email !== "string") {
                throw new BadRequestError("email' do usuário deve ser string.")
            }
        } else {
            throw new BadRequestError("'email' do usuário deve ser informado.")
        }

        if (password !== undefined) {
            if (typeof password !== "string") {
                throw new BadRequestError("password' do usuário deve ser string.")
            }
        } else {
            throw new BadRequestError("'password' do usuário deve ser informado.")
        }


        const dto: LoginUserInputDTO = {
            email,
            password
        }
        return dto
    }


    public loginUserOutput(user: any): SignupUserOutputDTO {
        const dto: SignupUserOutputDTO = {
            token: "um token jwt"
        }
        return dto
    }



}
