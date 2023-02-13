import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controler/UserController"
import { UserDatabase } from "../database/UserDatabase"
import { UserDTO } from "../dto/UserDTO"


export const userRouter = express.Router()

const userController = new UserController(
    new UserDTO(),
    new UserBusiness(
        new UserDTO(),
        new UserDatabase()
    )
)

userRouter.get("/", userController.getUsers)
userRouter.post("/signup", userController.signUp)
userRouter.post("/login", userController.login)



