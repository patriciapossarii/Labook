export enum USER_ROLES {
    USER = "USER",
    ADMIN = "ADMIN"
}


export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}


export interface TSignupRequest {
    name: string,
    email: string,
    password: string,
}

export interface TSignupResponse {
    token: string
}

export interface TLoginRequest {
    email: string,
    password: string,
}

export interface TPostRequest {
    content: string
}



export type TUserPost = {
    id: string,
    name: string
}

export type TUserPostDB = {
    userId: string,
    postId: string
}

export interface PostWithUser {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: TUserPost
}

export type TUserDB = {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
    createdAt: string
}

export type TPostDB = {
    id: string,
    creatorId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string
}

export interface UpdatePost{
    content:string
}