import { PostDB, UpdatePost } from "../types"
import { BaseDatabase } from "./BaseDatabase"
import { UserDatabase } from "./UserDatabase"

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"


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

    public async findPostById(id:string | undefined):Promise <PostDB > {
        const [result]: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id: id })
        return result
    }

    public async findPostsByUserId(id: string) {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ creator_id: id })
        return result
    }

    public async postUser() {
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

    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async updatePost(updatePostDB:PostDB){
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update(updatePostDB)
        .where({id:updatePostDB.id})
    }


}