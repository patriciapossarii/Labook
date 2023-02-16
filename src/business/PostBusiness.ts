import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, PostDTO } from "../dto/PostDTO"
import { PostWithUser } from "../types"
import { PostDB } from "../types";
import { Post } from "../models/Post";
import { TPostRequest } from "../types";
import moment, { Moment } from 'moment'
import { UserDatabase } from "../database/UserDatabase";
import { BadRequestError } from "../erros/BadRequest";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, USER_ROLES } from "../services/TokenManager";
import { request } from "http";

export class PostBusiness {
    constructor(
        private postDTO: PostDTO,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private userDatabase: UserDatabase
    ) { }

    public getPosts = async (input: GetPostsInputDTO) => {
        const { q, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.USER) {
            throw new BadRequestError("Acesso Negado! Seu acesso é de usuário")
        }

        const result: PostWithUser[] = []

        const posts = await this.postDatabase.postUser(q)
        for (let post of posts) {
            let postWithUser: PostWithUser = {
                id: post.id,
                content: post.content,
                likes: post.likes,
                dislikes: post.dislikes,
                createdAt: post.createdAt,
                updatedAt: post.updateAt,
                creator: {
                    id: post.uid,
                    name: post.name
                }
            }
            result.push(postWithUser)
        }
        const output = this.postDTO.getPostOutput(result)
        return output
    }


    public createPost = async (input: CreatePostInputDTO) => {
        const { content, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.USER) {
            throw new BadRequestError("Acesso Negado! Seu acesso é de usuário")
        }
        if (content.length < 2) {
            throw new BadRequestError("'content' do post inválido. Deve conter no mínimo 2 caracteres")
        }
        let myuuid = this.idGenerator.generate()

        const newPost = new Post(
            myuuid,
            payload?.id as string,
            content,
        )
        const newPostDB: PostDB = {
            id: newPost.getId(),
            creator_id: newPost.getCreatorId(),
            content: newPost.getContent(),
            likes: newPost.getLikes(),
            dislikes: newPost.getDislikes(),
            created_at: newPost.getCreatedAt(),
            updated_at: newPost.getUpdatedAt()
        }
        await this.postDatabase.insertPost(newPostDB)
        const output = {
            message: "Post registrado com sucesso",
        }
        return output
    }


    public editPostById = async (input: EditPostInputDTO) => {
        const { userId, idToEdit, newContent } = input
        if (newContent.length < 2) {
            throw new BadRequestError("'content' do post inválido. Deve conter no mínimo 2 caracteres")
        }
        const postToEditDB = await this.postDatabase.findPostById(idToEdit)
        if (!postToEditDB) {
            throw new BadRequestError("'id' para editar não existe")
        }

        if (postToEditDB.creator_id === userId) {
            var date = Date.now()
            let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')
            const post = new Post(
                postToEditDB.id,
                postToEditDB.creator_id,
                newContent || postToEditDB.content,
                postToEditDB.likes,
                postToEditDB.dislikes,
                postToEditDB.created_at,
                dateNow
            )
            const updatePostDB: PostDB = {
                id: post.getId(),
                creator_id: post.getCreatorId(),
                content: post.getContent(),
                likes: post.getLikes(),
                dislikes: post.getDislikes(),
                created_at: post.getCreatedAt(),
                updated_at: post.getUpdatedAt()
            }
            await this.postDatabase.updatePost(updatePostDB)
            const output = {
                message: "Post editado com sucesso",
            }
            return output
        } else {
            throw new BadRequestError("Post/User inválido")
        }
    }


    public deletPostById = async (input: DeletePostInputDTO) => {
        const { userId, idToDelet } = input

        if (idToDelet === ":id") {
            throw new BadRequestError("'id' deve ser informado")
        }

        const postToDeletBD = await this.postDatabase.findPostById(idToDelet)
        if (!postToDeletBD) {
            throw new BadRequestError("'id' para deletar não existe")
        }

        if (postToDeletBD.creator_id === userId) {
            await this.postDatabase.deletePostById(postToDeletBD.id)
            const output = {
                message: "Post deletado com sucesso"
            }
            return output
        } else {
            throw new BadRequestError("Post/User inválido")
        }
    }


    public likeDislike = async (input: any) => {
        const { postId, newLikeDislike, token } = input

        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequestError("Acesso Negado! Seu acesso é de usuário")
        }
        const userId = payload?.id as string


        const postExistDB = await this.postDatabase.findPostById(postId)
        if (!postExistDB) {
            throw new Error("'id' do post não existe")
        }


        if (newLikeDislike !== undefined) {
            if (typeof newLikeDislike !== "boolean") {
                throw new Error("'like' do post deve ser boolean (true ou false).")
            }
        }


        let value = 0
        if (newLikeDislike === true) {
            value = 1
        }

        console.log("valueee", value)

        const checkLikePost = await this.postDatabase.checkPostWithLike(userId, postId)

        console.log(checkLikePost)

        if (checkLikePost.length >= 1) {
            if (checkLikePost[0].like === value) {
                if (value === 1) {
                    postExistDB.likes = postExistDB.likes - 1
                } else {
                    postExistDB.dislikes = postExistDB.dislikes - 1
                }
                await this.postDatabase.removeLikeDislike(userId, postId)
                await this.postDatabase.updatePost(postExistDB)
            } else {
                if (checkLikePost[0].like === 1) {
                    postExistDB.dislikes = postExistDB.dislikes + 1
                    postExistDB.likes = postExistDB.likes -1
                    checkLikePost[0].like = 0
                } else {
                    postExistDB.dislikes = postExistDB.dislikes - 1
                    postExistDB.likes = postExistDB.likes +1
                    checkLikePost[0].like = 1
                }
                await this.postDatabase.updatetLikeDislike(checkLikePost[0].like)
                await this.postDatabase.updatePost(postExistDB)
            }
        } else {
            await this.postDatabase.insertLikeDislike(userId, postId, value)
            if (value === 1) {
                postExistDB.likes = postExistDB.likes + 1
            } else {
                postExistDB.dislikes = postExistDB.dislikes + 1
            }
            await this.postDatabase.updatePost(postExistDB)
        }

        // const insertLikeDislike = await this.postDatabase.insertLikeDislike(userId, postId, value)



        const output = {
            message: "Like editado com sucesso",
            checkLikePost: checkLikePost
        }
        return output
    }

}