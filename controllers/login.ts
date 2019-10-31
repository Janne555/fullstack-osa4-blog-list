import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Router } from 'express'
import User from '../models/user'

const loginRouter = Router()

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)
  if (!(user && passwordCorrect))
    return response.status(401).json({ error: 'invalid password' })

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter