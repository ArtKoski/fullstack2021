import React, { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 4,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}


const Blog = ({ user, blog, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)
  const[removeButton, setRemoveButton] = useState(false)

  const onClick = function() {
    setVisible(!visible)
    setRemoveButton((user === null ? '' : user.username === blog.user.username))
  }

  return (
    <div id="blog-details" className="blog" style={blogStyle}>
      <div>
        <h4>
          {blog.title}
          <b> | </b>
          {blog.author}
          <b> </b>
          <button
            id='show-button'
            className="showButton"
            onClick={onClick}>{visible ? 'hide' : 'show'}</button>
        </h4>
      </div>
      {visible &&
      <div>
        <div>
          {blog.url}
        </div>
        <div>
          <span id='like-amount'>
            {blog.likes}
          </span>
          <button id='like-button' onClick={handleLike} value={blog.id}>
          like
          </button>

        </div>
        {user !== undefined &&
        <div>
          {blog.user.name}
        </div>
        }
        {removeButton &&
        <button id='remove-button' onClick={handleRemove} value={blog.id}>
            remove
        </button>}
      </div>}
    </div>
  )
}

export default Blog