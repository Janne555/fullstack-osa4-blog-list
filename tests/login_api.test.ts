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

describe('with a user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', passwordHash: '$2b$10$fwFokPZxD19YRiJT.3RZr.sgvKmiqLypQseoKwdrL/vRUPHcSnpUe' })
    await user.save()
  })

  test('should login', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    expect(response.body).toHaveProperty('username', 'root')
  })

})
