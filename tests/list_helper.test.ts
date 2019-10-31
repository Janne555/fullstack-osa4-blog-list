import { IBlog } from '../types'
import * as listHelper from '../utils/list_helper'

test('dummy returns one', () => {
  const blogs: IBlog[] = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})