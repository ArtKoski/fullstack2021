import React, { useState } from 'react'

const BlogForm = ({ createBlog } ) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  const handleTitleChange = async (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = async (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = async (event) => {
    setUrl(event.target.value)
  }

  return(
    <div>
      <h4>
        create new
      </h4>
      <form id='form' onSubmit={addBlog}>
        <p>title:
          <input
            id='title'
            name="title"
            value={title}
            onChange={handleTitleChange} />
        </p>
        <p>author:
          <input
            id='author'
            name="author"
            value={author}
            onChange={handleAuthorChange} />
        </p>
        <p>url:
          <input
            id='url'
            name="url"
            value={url}
            onChange={handleUrlChange} />
        </p>
        <button id="create-blog-button" type="submit">create</button>

      </form>
    </div>
  )
}

export default BlogForm