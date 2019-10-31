import { IBlog } from '../types'
import Blog from '../models/blog'
import * as listHelper from '../utils/list_helper'
import { blogs } from '../tests/mocks/blogs'

test('dummy returns one', () => {
  const blogs: IBlog[] = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const blog = new Blog({
    _id: 'somethingsomething',
    title: 'blogi',
    author: 'blogaaja',
    url: 'site.blog',
    likes: 5,
    __v: 0
  })

  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes([blog])).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})
