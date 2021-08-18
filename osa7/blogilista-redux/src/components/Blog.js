import React/*, { useState }*/ from 'react'
import { useField } from '../hooks/index'
import { commentBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 4,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

export const BlogTitle = ( { blog } ) => {
  return (
    <div style={blogStyle}>
      <h4>{blog.title}</h4>
    </div>
  )
}

const CommentForm = ( { id } ) => {
  const dispatch = useDispatch()
  const comment = useField('text')

  const addComment = async (event) => {
    event.preventDefault()

    dispatch(commentBlog(id, comment.value))
    comment.reset()

  }

  return(
    <div>
      <h2>create new comment</h2>
      <form onSubmit={addComment}>
        <input name='comment' {...comment} reset='' />
        <button type="submit">send</button>
      </form>
    </div>
  )

}

const CommentSection = ( { comments } ) => {
  if(!comments) {
    return (
      null
    )
  }
  return (
    <div>
      <h4>comments</h4>
      <ul>
        {comments.map(comment =>
          <li key={comment}>
            {comment}
          </li>
        )
        }
      </ul>
    </div>
  )
}

const Blog = ({ user, blog, handleLike, handleRemove }) => {
  let removeButton = (user === null ? false : user.username === blog.user.username)
  return (
    <div id="blog-details" className="blog">
      <div>
        <h2>
          {blog.title}
          <b> | </b>
          {blog.author}
          <b> </b>
        </h2>
      </div>
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
          added by {blog.user.name}
        </div>
        }
        {removeButton  &&
        <button id='remove-button' onClick={handleRemove} value={blog.id}>
            remove
        </button>}
      </div>
      <CommentForm id={blog.id}/>
      <CommentSection comments={blog.comments} />
    </div>
  )
}

export default Blog