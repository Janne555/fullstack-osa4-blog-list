import { Response, Request } from 'express'
import { NextFunction } from 'connect'

export function unknownEndpoint(request: Request, response: Response) {
  response.status(404).send({ error: 'unknown endpoint' })
}

export function errorHandler(error: any, request: Request, response: Response, next: NextFunction) {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message.split('\n')[0] })
  }

  next(error)
}