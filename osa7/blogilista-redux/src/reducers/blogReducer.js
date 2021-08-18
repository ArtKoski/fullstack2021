/* eslint-disable no-case-declarations */
import blogService from '../services/blogs.js'

const reducer = (state = [], action) => {
  switch(action.type) {
  case 'LIKE':
    const id = action.data
    const blogToChange = state.find(n => n.id === id)
    const changedBlog = {
      ...blogToChange, likes: ( blogToChange.likes + 1 )
    }
    return state.map(blog => blog.id !== id ? blog : changedBlog)

  case 'NEW_BLOG':
    return state.concat(action.data)

  case 'INIT_BLOGS':
    return action.data

  case 'REMOVE':
    return state.filter(blog => blog.id !== action.data)

  case 'NEW_COMMENT':
    const comment = action.data.comment

    const blogToUpdate = state.find(n => n.id === action.data.id)
    const updatedBlog = {
      ...blogToUpdate, comments: blogToUpdate.comments.concat(comment)
    }
    return state.map(blog => blog.id !== action.data.id ? blog : updatedBlog)

  default:
    return state
  }
}

export const removeBlog = (id) => {
  return async dispatch => {

    await blogService.remove(id)

    dispatch ({
      type: 'REMOVE',
      data: id
    })
  }
}


export const likeBlog = (id) => {

  return async dispatch => {
    const allBlogs = await blogService.getAll()
    const blog = allBlogs.find(blog => blog.id === id)

    const updatedBlog = { ...blog, likes: (blog.likes + 1) }
    const response = await blogService.update(updatedBlog.id, updatedBlog)
    dispatch ({
      type: 'LIKE',
      data: response.id
    })
  }
}


export const createBlog = (content) => {
  return async dispatch => {

    const newBlog = await blogService.create(content)

    const allBlogs = await blogService.getAll()
    const newBlogWithPopulatedUser = allBlogs.find(blog => blog.id === newBlog.id)

    dispatch ({
      type: 'NEW_BLOG',
      data: {
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
        id: newBlog.id,
        likes: newBlog.likes,
        user: newBlogWithPopulatedUser.user,
        comments: newBlog.comments
      }
    })
  }
}

export const commentBlog = ( id, comment ) => {
  return async dispatch => {

    await blogService.createComment(id, comment)

    dispatch({
      type: 'NEW_COMMENT',
      data: {
        comment: comment,
        id: id
      }
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export default reducer