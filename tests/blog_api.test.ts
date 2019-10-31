import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import Blog from '../models/blog'
import { blogs } from './mocks/blogs'
import { IBlog } from '../types'
import { blogsInDb } from './test_helper'
import User from '../models/user'
import jwt from 'jsonwebtoken'

const api = supertest(app)

const userForToken = {
  username: 'root',
  id: '5dbada064be4fe4e8d3471e8'
}

const token = jwt.sign(userForToken, process.env.SECRET)


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

describe('with blog by a user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const user = new User({ username: 'root', passwordHash: '$2b$10$fwFokPZxD19YRiJT.3RZr.sgvKmiqLypQseoKwdrL/vRUPHcSnpUe', _id: '5dbada064be4fe4e8d3471e8', notes: ['5dbad43dcbf4da41f768ed6a'] })
    await user.save()

    const blog = new Blog({
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: '5dbada064be4fe4e8d3471e8',
      _id: '5dbad43dcbf4da41f768ed6a'
    })
    await blog.save()

    user.blogs = user.blogs.concat(blog)
    await user.save()
  })

  test('should return blog with user', async () => {
    const response = await api.get('/api/blog')
    expect(response.body[0].user.username).toEqual('root')
  })


  test('deleting with proper id deletes a blog', async () => {
    await api
      .delete('/api/blog/5dbad43dcbf4da41f768ed6a')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd.length).toBe(0)
  })
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

  test('deleting with proper id deletes a blog but without token results in error', async () => {
    await api
      .delete(`/api/blog/${blogs[1]._id}`)
      .expect(401)
  })

  test('deleting with no id results in error', async () => {
    await api
      .delete('/api/blog/asd')
      .set('Authorization', `Bearer ${token}`)
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
    await User.deleteMany({})
    const otherUser = new User({ username: 'asd', password: 'asdasd' })
    const user = new User({ username: 'root', passwordHash: '$2b$10$fwFokPZxD19YRiJT.3RZr.sgvKmiqLypQseoKwdrL/vRUPHcSnpUe', _id: '5dbada064be4fe4e8d3471e8' })
    await user.save()
    await otherUser.save()
  })

  test('adds a blog to the database', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(otherBlog)
      .expect(400)
  })

  test('should set user from token as owner of blog', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtStart.length).toBe(0)
    expect(blogsAtEnd.length).toBe(1)
    const { user }: IBlog = blogsAtEnd[0]
    expect(user.toString()).toEqual('5dbada064be4fe4e8d3471e8')
  })


})