import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'titteli',
    author: 'julkaisija',
    url: 'urli',
    likes: '0'
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'julkaisija' && 'titteli'
  )

  expect(component.container).not.toHaveTextContent(
    'url' || 'likes'
  )
})

test('clicking the show button renders url and likes', async () => {
  const blog = {
    title: 'titteli',
    author: 'julkaisija',
    url: 'urli',
    likes: '0'
  }

  const component = render(
    <Blog blog={blog} />
  )

  const button = component.getByText('show')
  fireEvent.click(button)


  expect(component.container).toHaveTextContent(
    'url' && '0' && 'like'
  )


})


test('clicking the like button twice calls upon handler twice', async () => {
  const blog = {
    title: 'titteli',
    author: 'julkaisija',
    url: 'urli',
    likes: '0'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLike={mockHandler} />
  )

  const buttonShow = component.getByText('show')
  fireEvent.click(buttonShow)

  const buttonLike = component.getByText('like')

  fireEvent.click(buttonLike)
  fireEvent.click(buttonLike)

  expect(mockHandler.mock.calls).toHaveLength(2)

})