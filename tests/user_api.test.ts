import User from '../models/user'
import { usersInDb } from './test_helper'
import supertest from 'supertest'
import app from '../app'
import mongoose from 'mongoose'
import Blog from '../models/blog'

const api = supertest(app)

afterAll(() => {
  mongoose.connection.close()
})

describe('when there is one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'user',
      name: 'person',
      password: 'salasana'
    }

    await api
      .post('/api/user')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/user')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('finds all users', async () => {
    const users = await api.get('/api/user')
    expect(users.body.length).toBe(1)
  })

  test('should reject short password', async () => {
    const response = await api
      .post('/api/user')
      .send({ username: 'username', password: 'a' })
      .expect(400)
    expect(response.body.error).toContain('password is too short')
  })

  test('should reject short username', async () => {
    const response = await api
      .post('/api/user')
      .send({ username: 'u', password: 'password is longer' })
      .expect(400)

    expect(response.body.error).toContain('username')
    expect(response.body.error).toContain('is shorter than the minimum')
  })
})

describe('when the database has a user with blogs', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret', _id: '5dbad43ccbf4da41f768ed69', notes: ['5dbad43dcbf4da41f768ed6a'] })
    await user.save()

    const blog = new Blog({
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: '5dbad43ccbf4da41f768ed69',
      _id: '5dbad43dcbf4da41f768ed6a'
    })
    await blog.save()

    user.blogs = user.blogs.concat(blog)
    await user.save()
  })

  test('should return user with blogs', async () => {
    const response = await api.get('/api/user')
    expect(response.body).toContainEqual({ 'blogs': [{ 'author': 'Michael Chan', 'id': '5dbad43dcbf4da41f768ed6a', 'likes': 7, 'title': 'React patterns', 'url': 'https://reactpatterns.com/', 'user': '5dbad43ccbf4da41f768ed69' }], 'id': '5dbad43ccbf4da41f768ed69', 'username': 'root' })
  })

})

