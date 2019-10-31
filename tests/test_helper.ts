import User from '../models/user'
import Blog from '../models/blog'

export async function usersInDb() {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

export async function blogsInDb() {
  const users = await Blog.find({})
  return users.map(u => u.toJSON())
}