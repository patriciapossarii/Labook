import { PostDB, UpdatePost } from "../types"
import { BaseDatabase } from "./BaseDatabase"
import { UserDatabase } from "./UserDatabase"

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"


    public async findPosts(q: string | undefined) {
        let postsDB
        if (q) {
            const result: PostDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)
                .where("name", "LIKE", `%${q}%`)
            postsDB = result
        } else {
            const result: PostDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)
            postsDB = result
        }
        return postsDB
    }


    public async allPosts() {
        const result: PostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
        return result
    }


    public async findPostById(id: string | undefined): Promise<PostDB> {
        const [result]: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id: id })
        return result
    }


    public async findPostsByUserId(id: string) {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ creator_id: id })
        return result
    }


    public async postUser(q: string | undefined) {
        if (q) {
            const result = await BaseDatabase.connection(`${PostDatabase.TABLE_POSTS} as p`).innerJoin("users as u", "p.creator_id", "=", "u.id").select(
                "p.id as id",
                "p.content as content",
                "p.likes as likes",
                "p.dislikes as dislikes",
                "p.created_at as createdAt",
                "p.updated_at as updateAt",
                "u.id as uid",
                "u.name as name"
            ).where("content", "LIKE", `%${q}%`)
            return result
        } else {
            const result = await BaseDatabase.connection(`${PostDatabase.TABLE_POSTS} as p`).innerJoin("users as u", "p.creator_id", "=", "u.id").select(
                "p.id as id",
                "p.content as content",
                "p.likes as likes",
                "p.dislikes as dislikes",
                "p.created_at as createdAt",
                "p.updated_at as updateAt",
                "u.id as uid",
                "u.name as name"
            )
            return result
        }
    }


    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }


    public async updatePost(updatePostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(updatePostDB)
            .where({ id: updatePostDB.id })
    }


    public async deletePostById(id: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id: id })
    }


    public async checkPostWithLike(userId: string, postId: string) {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .where({ user_id: userId, post_id: postId })
        return result
    }

/*
    public async checkPostUser(idPost: string, idUser: string) {
        const postDB = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id: idPost, creator_id: idUser })
        return postDB
    }
*/

public async insertLikeDislike(userId: string, postId:any, value:any) {
    const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
       .insert({user_id:userId, post_id:postId,like: value})
    return result
}

public async updatetLikeDislike( value:number,userId:string, postId:string) {
    const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
       .update({like: value}).where({user_id:userId, post_id:postId})
    return result
}


public async removeLikeDislike(userId:string, postId:string) {
    const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
       .delete().where({user_id:userId, post_id:postId})
    return result
}

public async updatePostLike(value:number,postId:string) {
    await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update({like:value})
        .where({ post_id: postId })
}
public async updatePostDislike(value:number,postId:string) {
    await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update({dislike:value})
        .where({ post_id: postId })
}
public async deleteLikesInDeletePost ( postId:string) {
    const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
       .delete().where({post_id:postId})
    return result
}
}