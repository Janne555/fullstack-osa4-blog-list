import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import Blog from '../models/blog'
import { blogs } from './mocks/blogs'
import { IBlog } from '../types'

const api = supertest(app)

afterAll(async () => {
  await Blog.deleteMany({})
  mongoose.connection.close()
})

describe('with some blogs at the start', () => {
  beforeAll(async () => {
    await Blog.deleteMany({})
    await Promise.all(blogs.map(blog => blog.save()))
  })

  afterAll(async () => {
    await Blog.deleteMany({})
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all blogs', async () => {
    const response = await api.get('/api/blog')
    expect(response.body.length).toBe(blogs.length)
  })

  test('a specific blog is within returned blogs', async () => {
    const response = await api.get('/api/blog')
    expect(response.body.map((blog: IBlog) => blog.url)).toContainEqual(blogs[0].url)
  })

  test('id field shoud be correct', async () => {
    const response = await api.get('/api/blog')
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).not.toHaveProperty('_id')
  })

  test('with proper id deletes a blog', async () => {
    await api
      .delete(`/api/blog/${blogs[0]._id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blog')
    expect(blogsAtEnd.body.length).toBe(blogs.length - 1)
    expect(blogsAtEnd.body.map((b: IBlog) => b.title)).not.toContain(blogs[0].title)
  })

  test('with no id results in error', async () => {
    await api
      .delete('/api/blog/asd')
      .expect(400)
  })
})

describe('with no blogs at the start', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  })

  afterEach(async () => {
    await Blog.deleteMany({})
  })

  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  }

  test('adds a blog to the database', async () => {
    let response = await api.get('/api/blog')
    expect(response.body.length).toBe(0)

    await api
      .post('/api/blog')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    response = await api.get('/api/blog')
    expect(response.body.length).toBe(1)
    const { author, url, likes, title }: IBlog = response.body[0]
    expect({ author, url, likes, title }).toEqual(blog)
  })

  test('adds like: 0 if it is not defined', async () => {
    const otherBlog = { ...blog }
    delete otherBlog.likes

    await api
      .post('/api/blog')
      .send(otherBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let response = await api.get('/api/blog')
    const { author, url, likes, title }: IBlog = response.body[0]
    expect({ author, url, likes, title }).toEqual({ ...blog, likes: 0 })
  })

  test('a blog missing title and url results in 400', async () => {
    const otherBlog = { ...blog }
    delete otherBlog.url
    delete otherBlog.title

    await api
      .post('/api/blog')
      .send(otherBlog)
      .expect(400)
  })

})