import * as config from './utils/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import blogRouter from './controllers/blogs'
import morgan from 'morgan'
import { unknownEndpoint, errorHandler, tokenExtractor } from './utils/middleware'
import * as logger from './utils/logger'
import userRouter from './controllers/users'
import loginRouter from './controllers/login'

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.set('useFindAndModify', false)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => logger.info('connected to MongoDB'))
  .catch(error => logger.error('error connecting to mongoDB:', error.message))

morgan.token('post_body', (req) => {
  return req.headers['content-type'] && req.headers['content-type'].includes('application/json') ? JSON.stringify(req.body) : ''
})

app.use(cors())
// if (process.env.NODE_ENV !== 'test')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_body'))
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

export default app