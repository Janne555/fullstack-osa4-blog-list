import { Router } from 'express'
import Blog from '../models/blog'
const blogRouter = Router()

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  if (blog.likes === undefined)
    blog.likes = 0
  if (!blog.title && !blog.url)
    return response.status(400).end()
  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

export default blogRouter