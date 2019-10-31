import { IBlog } from '../types'
import countBy from 'lodash/countBy'
import groupBy from 'lodash/groupBy'

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

export function mostLikes(blogsList: IBlog[]): { author: string, likes: number } | undefined {
  const bloggers = groupBy(blogsList, 'author')
  const result = Object.entries(bloggers).reduce((result: { author: string, likes: number }, [author, blogs]) => {
    const likes = totalLikes(blogs)
    return likes > result.likes ? { author, likes } : result
  }, { author: '', likes: 0 })
  return result.author !== '' ? result : undefined
}