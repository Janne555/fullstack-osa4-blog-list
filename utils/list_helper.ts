import { IBlog } from '../types'


export function dummy(blogs: IBlog[]): 1 {
  return 1
}

export function totalLikes(blogs: IBlog[]): number {
  return blogs.reduce((sum, { likes }) => sum + likes, 0)
}

export function favoriteBlog(blogs: IBlog[]): IBlog | undefined {
  let copyBlogs = [...blogs]
  copyBlogs.sort((a, b) => b.likes - a.likes)
  return copyBlogs[0]
}