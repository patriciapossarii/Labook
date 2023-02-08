import moment, { Moment } from 'moment'
var date = Date.now()
let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')
export class Post {

    constructor(
        private id: string,
        private creatorId: string,
        private content: string,
        private likes: number = 0,
        private dislikes: number = 0,
        private createdAt: string = dateNow,
        private updatedAt: string = dateNow
    ) { }

    public getId(): string {
        return this.id
    }
    public setId(value: string): void {
        this.id = value
    }

    public getCreatorId(): string {
        return this.creatorId
    }
    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public getContent(): string {
        return this.content
    }
    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): number {
        return this.likes
    }
    public setLikes(value: number): void {
        this.likes = value
    }

    public getDislikes(): number {
        return this.dislikes
    }
    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }
    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }
}