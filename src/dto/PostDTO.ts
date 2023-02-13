import { BadRequestError } from "../erros/BadRequest"
import { Post } from "../models/Post"
import { PostWithUser } from "../types"

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


}