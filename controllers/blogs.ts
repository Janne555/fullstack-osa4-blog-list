import { Router, Request } from 'express'
import Blog from '../models/blog'
import User from '../models/user'
import jwt from 'jsonwebtoken'

const blogRouter = Router()

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs.map(b => b.toJSON()))
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request: Request & { token?: string }, response, next) => {
  if (!request.token)
    return response.status(401).json({ error: 'token missing' })

  const blog = new Blog(request.body)

  if (blog.likes === undefined)
    blog.likes = 0
  if (!blog.title && !blog.url)
    return response.status(400).end()
  try {
    const decodedToken: any = jwt.verify(request.token, process.env.SECRET)
    if (!('id' in decodedToken))
      return response.status(401).json({ error: 'token missing' })

    const user = await User.findById(decodedToken.id)

    blog.user = user._id
    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    response.status(201).json(result.toJSON())
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request: Request & { token?: string }, response, next) => {
  if (!request.token)
    return response.status(401).json({ error: 'token missing' })
  try {
    const decodedToken: any = jwt.verify(request.token, process.env.SECRET)
    if (!('id' in decodedToken))
      return response.status(401).json({ error: 'token missing' })

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    console.log(request.params.id, decodedToken.id, user, blog)

    if (blog.user.toString() !== user._id.toString())
      return response.status(401).json({ error: 'not auhtorized' })

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