import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('asd', () => {
  const mockHandler = jest.fn()

  const component = render(
    <BlogForm createBlog={mockHandler} />
  )

  const author = component.container.querySelector('#author')
  const title = component.container.querySelector('#title')
  const url = component.container.querySelector('#url')

  const form = component.container.querySelector('form')

  fireEvent.change(author, {
    target: { value: 'testing' }
  })
  fireEvent.change(title, {
    target: { value: 'could DEFINITELY' }
  })
  fireEvent.change(url, {
    target: { value: 'be easier' }
  })
  fireEvent.submit(form)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].author).toBe('testing')
  expect(mockHandler.mock.calls[0][0].title).toBe('could DEFINITELY')
  expect(mockHandler.mock.calls[0][0].url).toBe('be easier')
})
