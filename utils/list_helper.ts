import { IBlog } from '../types'


export function dummy(blogs: IBlog[]): 1 {
  return 1
}

export function totalLikes(blogs: IBlog[]): number {
  return blogs.reduce((sum, { likes }) => sum + likes, 0)
}