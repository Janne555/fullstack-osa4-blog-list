import { Router } from 'express'
import User from '../models/user'
import bcrypt from 'bcrypt'

const userRouter = Router()

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs')
    response.json(users.map(u => u.toJSON()))
  } catch (error) {
    next(error)
  }
})

userRouter.post('/', async (request, response, next) => {
  if (!request.body.password || request.body.password.length < 3)
    return response.status(400).send({ error: 'password is too short' })

  try {
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const result = await user.save()
    response.json(result.toJSON())
  } catch (error) {
    next(error)
  }
})

export default userRouter