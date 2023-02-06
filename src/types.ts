export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
    created_at: string
}


export interface TSignupRequest {
    name: string,
    email: string,
    password: string,
}

export interface TLoginRequest {
    email: string,
    password: string,
}