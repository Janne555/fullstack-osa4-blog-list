import { Schema, model } from 'mongoose'
import { IUser } from '../types'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = model<IUser>('User', userSchema)

export default User