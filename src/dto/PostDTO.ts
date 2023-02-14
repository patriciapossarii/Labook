import { BadRequestError } from "../erros/BadRequest"
import { Post } from "../models/Post"
import { PostWithUser, TPostRequest } from "../types"

export interface GetPostsInputDTO {
    q: string | undefined
}

export interface GetPostsOutputDTO {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string
    creator: {
        id: string,
        name: string
    }
}

export interface CreatePostInputDTO {
    content: string,
    user:string
}

export interface EditPostInputDTO {
    userId:string,
    idToEdit: string,
    newContent: string
}

export interface DeletePostInputDTO {
    userId:string,
    idToDelet: string
}


export class PostDTO {

    public getPostInput(
        q: unknown
    ): GetPostsInputDTO {
        if (q !== undefined) {
            if (typeof q !== "string") {
                throw new BadRequestError("'q'  deve ser string.")
            }
        }
        const dto: GetPostsInputDTO = {
            q
        }
        return dto
    }


    public getPostOutput(postWithUser: PostWithUser[]): GetPostsOutputDTO[] {
        return postWithUser.map((post) => ({
            id: post.id,
            content: post.content,
            likes: post.likes,
            dislikes: post.dislikes,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            creator: {
                id: post.creator.id,
                name: post.creator.name
            }
        }))
    }


    public createPostInput(
        content: unknown,
        user:string): CreatePostInputDTO {
        if (content !== undefined) {
            if (typeof content !== "string") {
                throw new BadRequestError("'content' do post deve ser string.")
            }
        } else {
            throw new BadRequestError("'content' do post deve ser informado.")
        }
        const dto: CreatePostInputDTO = {
            content,
            user
        }
        return dto
    }


    public editPostInput(
        userId:string,
        idToEdit: string,
        newContent: unknown): EditPostInputDTO {
        if (newContent !== undefined) {
            if (typeof newContent !== "string") {
                throw new BadRequestError("'content' do post deve ser string.")
            }
        } else {
            throw new BadRequestError("'content' do post deve ser informado.")
        }
        const dto: EditPostInputDTO = {
            userId,
            idToEdit,
            newContent
        }
        return dto
    }

    
    public deletePostInput(
        userId:string,
        idToDelet: string): DeletePostInputDTO {
        if (idToDelet !== undefined) {
            if (typeof idToDelet !== "string") {
                throw new BadRequestError("'id' do post deve ser string.")
            }
        } else {
            throw new BadRequestError("'id' do post deve ser informado.")
        }
        const dto: DeletePostInputDTO = {
            userId,
            idToDelet
        }
        return dto
    }


}