import { UserDatabase } from "../database/UserDatabase";
import { GetUserInputDTO, LoginUserInputDTO, SignupUsertInputDTO, UserDTO } from "../dto/UserDTO";
import { User } from "../models/User";
import { UserDB, USER_ROLES } from "../types";
import { BadRequestError } from "../erros/BadRequest";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";


export class UserBusiness {
    constructor(
        private userDTO: UserDTO,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getUsers = async (input: GetUserInputDTO) => {
        const { q } = input
        const teste = await this.userDatabase.findUsers(q)
        const users: User[] = teste.map((userDB) => new User(
            userDB.id,
            userDB.name,
            userDB.email,
            "",
            userDB.role,
            userDB.created_at
        ))
        const output = this.userDTO.getUserOutput(users)
        return output
    }


    public signUp = async (input: SignupUsertInputDTO) => {
        if (input.name.length < 2) {
            throw new BadRequestError("'name' do usuário inválido. Deve conter no mínimo 2 caracteres")
        }
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        if (expression.test(input.email) != true) {
            throw new BadRequestError("'email'do usuário em formato inválido. Ex.: 'exemplo@exemplo.com'.")
        }
        const emailExists = await this.userDatabase.checkEmailUserExist(input.email)
        if (emailExists.length >= 1) {
            throw new BadRequestError("'email' do usuário já existente.")
        }
        if (!input.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,12}$/g)) {
            throw new BadRequestError("'password' do usuário em formato inválido. Deve conter entre 4 a 12 caracteres, com 1 letra maiuscula, 1 letra minúscula, 1 número.")
        }

        let myuuid = this.idGenerator.generate()
        const newUser = new User(
            myuuid,
            input.name,
            input.email,
            input.password,
            USER_ROLES.USER
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
        const tokenPayLoad: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }
        const token = this.tokenManager.createToken(tokenPayLoad)
        const output = this.userDTO.signupUserOutout(token)
        return output
    }


    public login = async (request: LoginUserInputDTO) => {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        if (expression.test(request.email) != true) {
            throw new BadRequestError("'email'do usuário em formato inválido. Ex.: 'exemplo@exemplo.com'.")
        }
        let checkLog = await this.userDatabase.checkLogin(request.email, request.password)
        if (checkLog.length > 0) {
            const tokenPayLoad: TokenPayload = {
                id: checkLog[0].id,
                name: checkLog[0].name,
                role: checkLog[0].role
            }
            const token = this.tokenManager.createToken(tokenPayLoad)
            const output = this.userDTO.loginUserOutput(token)
            return output
        } else {
            throw new BadRequestError("Email ou senha inválido")
        }
    }
}