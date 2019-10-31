import { Router } from 'express'
import Blog from '../models/blog'
import User from '../models/user'
const blogRouter = Router()

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs.map(b => b.toJSON()))
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const [user] = await User.find({})
  const blog = new Blog(request.body)
  blog.user = user._id

  if (blog.likes === undefined)
    blog.likes = 0
  if (!blog.title && !blog.url)
    return response.status(400).end()
  try {
    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    response.status(201).json(result.toJSON())
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

blogRouter.put('/:id', async (request, response, next) => {
  if (!request.body.likes)
    return response.status(400).send()

  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, { likes: request.body.likes })
    response.status(200).json(result.toJSON())
  } catch (error) {
    next(error)
  }
})

export default blogRouter