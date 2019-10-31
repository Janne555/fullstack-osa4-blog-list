import { Schema, model } from 'mongoose'
import { IUser } from '../types'

const userSchema = new Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = model<IUser>('Blog', userSchema)

export default User