import { Document } from 'mongoose'

export interface IBlog extends Document {
  title: string,
  author: string,
  url: string,
  likes: number
}

export interface IUser extends Document {
  username: string
  name: string
  passwordHash: string
  blogs: IBlog['_id'][]
}