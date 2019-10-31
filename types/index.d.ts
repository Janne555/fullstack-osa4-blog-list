import { Document } from 'mongoose'

export interface IBlog extends Document {
  title: string,
  author: string,
  url: string,
  likes: number
}