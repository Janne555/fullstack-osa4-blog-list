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


describe('favourite blog', () => {
  test('finds favorite blog from a list of blogs', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual(new Blog({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }))
  })

  test('finds nothing from an empty list', () => {
    expect(listHelper.favoriteBlog([])).toBeUndefined()
  })

  test('finds one of the favorite blogs in a list with multiple blogs with the same amount of likes', () => {
    const blog: IBlog = new Blog({
      _id: 'asdasdasd',
      title: 'other book',
      author: 'Edsger W. Dijkstra',
      url: 'thisisalink',
      likes: 12,
      __v: 0
    })

    expect(listHelper.favoriteBlog([...blogs, blog])).toEqual(new Blog({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }))
  })
})

describe('most blogs', () => {
  test('finds blogger with most blogs', () => {
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('finds nothing from an empty list', () => {
    expect(listHelper.mostBlogs([])).toBeUndefined()
  })

  test('finds one of the bloggers with most blogs from a list where there are multiple bloggers with the same amount of blogs', () => {
    const blog = new Blog({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    })

    expect(listHelper.mostBlogs([blog, ...blogs])).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 3
    })
  })
})


describe('most likes', () => {
  test('finds blogger with most likes', () => {
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('finds nothing from an empty list', () => {
    expect(listHelper.mostLikes([])).toBeUndefined()
  })

  test('finds one of the bloggers with most likes from a list where there are multiple bloggers with the same amount of likes', () => {
    const blog = new Blog({
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 5,
      __v: 0
    })

    expect(listHelper.mostLikes([blog, ...blogs])).toEqual({
      author: 'Robert C. Martin',
      likes: 17
    })
  })
})
