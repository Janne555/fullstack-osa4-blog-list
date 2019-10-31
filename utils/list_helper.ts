import { IBlog } from '../types'
import countBy from 'lodash/countBy'

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

export function mostBlogs(blogsList: IBlog[]): { author: string, blogs: number } | undefined {
  const bloggers = countBy(blogsList, 'author')
  
  const result = Object.entries(bloggers).reduce((result: { author: string, blogs: number }, [author, blogs]) => {
    if (blogs > result.blogs)
      return { author, blogs }
    else
      return result
  }, { author: '', blogs: 0 })

  return result.author !== '' ? result : undefined
}