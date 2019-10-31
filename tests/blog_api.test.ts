import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import Blog from '../models/blog'
import { blogs } from './mocks/blogs'
import { IBlog } from '../types'

const api = supertest(app)

beforeAll(async () => {
  await Blog.deleteMany({})
  await Promise.all(blogs.map(blog => blog.save()))
})

afterAll(async () => {
  await Blog.deleteMany({})
  mongoose.connection.close()
})

describe('/api/blog', () => {
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
  
})