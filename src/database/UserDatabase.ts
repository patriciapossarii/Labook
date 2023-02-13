import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers(q: string | undefined) {
       
        if (q) {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("name", "LIKE", `%${q}%`)
                return result
        } else {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                return result
        }
        
    }

    public async checkIdlUserExist(id: string) {
        let usersDB
        const result = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id: id })
        usersDB = result
        return usersDB
    }

    public async checkEmailUserExist(email: string) {
        let usersDB
        const result = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ email: email })
        usersDB = result
        return usersDB
    }

    public async insertUser(newUserDB: UserDB) {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB)
    }

    public async checkLogin(email: string, password: string) {
        const userDB = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ email: email, password: password })
        return userDB
    }


    public async findUserById(id: string) {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id: id })
        return result
    }




}
