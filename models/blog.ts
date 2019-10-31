import { Schema, model } from 'mongoose'
import { IBlog } from '../types'

const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = model<IBlog>('Blog', blogSchema)

export default Blog