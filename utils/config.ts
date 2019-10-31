import dotenv from 'dotenv'
dotenv.config()

export let PORT = process.env.PORT
export let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test')
  MONGODB_URI = process.env.TEST_MONGODB_URI