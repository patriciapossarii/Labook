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
    content: string
}

export interface EditPostInputDTO {
    idToEdit: string,
    newContent: string
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
        content: unknown): CreatePostInputDTO {
        if (content !== undefined) {
            if (typeof content !== "string") {
                throw new BadRequestError("'content' do post deve ser string.")
            }
        } else {
            throw new BadRequestError("'content' do post deve ser informado.")
        }
        const dto: CreatePostInputDTO = {
            content
        }
        return dto
    }


    public editPostInput(
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
            idToEdit,
            newContent
        }
        return dto
    }


}