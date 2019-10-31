import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import Blog from '../models/blog'
import { blogs } from './mocks/blogs'
import { IBlog } from '../types'
import { blogsInDb } from './test_helper'

const api = supertest(app)

const blog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
}

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

  test('deleting with proper id deletes a blog', async () => {
    await api
      .delete(`/api/blog/${blogs[1]._id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd.length).toBe(blogs.length - 1)
    expect(blogsAtEnd.map((b: IBlog) => b.title)).not.toContain(blogs[1].title)
  })

  test('deleting with no id results in error', async () => {
    await api
      .delete('/api/blog/asd')
      .expect(400)
  })

  test('can update likes with valid id', async () => {
    await api
      .put(`/api/blog/${blogs[0]._id}`)
      .send({ ...blog, likes: 42 })
      .expect(200)
    const response = await blogsInDb()
    expect(response.find((b: any) => b.id === blogs[0]._id.toString())).toEqual({ ...blog, likes: 42, id: blogs[0]._id.toString() })
  })

  test('cant update likes without valid id', async () => {
    await api
      .put('/api/blog/asd')
      .send({ likes: 42 })
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

  test('adds a blog to the database', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .post('/api/blog')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtStart.length).toBe(0)
    expect(blogsAtEnd.length).toBe(1)
    const { author, url, likes, title }: IBlog = blogsAtEnd[0]
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

    let response = await blogsInDb()
    const { author, url, likes, title }: IBlog = response[0]
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