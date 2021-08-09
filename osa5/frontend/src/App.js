import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import LoginForm from './components/LogInForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const Notification = ({ message, classType }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={classType}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setSuccessMessage(
        '<Login successful!')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

    } catch (error) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (event) => {
    event.preventDefault()

    const oldBlog = await blogs.find(blog => blog.id===event.target.value)

    const newBlog = { ...oldBlog,
      likes: oldBlog.likes + 1
    }

    await blogService.update(oldBlog.id, newBlog)
    setBlogs(blogs.map(blog => blog.id !== oldBlog.id ? blog : newBlog))

  }

  const addBlog = async (blogObject) => {
    try {

      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      const updatedBlogs = await blogService.getAll()
      const populatedResponse = await updatedBlogs.filter(blog => blog.id === response.id)
      setBlogs(blogs.concat(populatedResponse))
      setSuccessMessage(
        `Blog '${blogObject.title} by '${blogObject.author}' added!`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

    }
    catch(error) {
      setErrorMessage('Validation error, blog not added.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async (event) => {
    const id = event.target.value
    try {
      const blog = await blogs.find(blog => blog.id===id)
      if(window.confirm(`Remove '${blog.name}' by '${blog.author}'?`)) {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
      }
    }
    catch(error) {
      console.log(error.message)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    setUser(null)
    blogService.setToken(null)

    window.localStorage.removeItem('loggedBlogappUser')

  }

  const loginForm = () => (

    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const addBlogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const listBlogs = () => {

    const sortedBlogs = blogs.sort((a,b) => b.likes-a.likes)

    return(
      <div id='all-blogs'>
        {sortedBlogs.map(blog =>
          <div id='single-blog' key={blog.id}>
            <Blog user={user} blog={blog} handleLike={handleLike} handleRemove={handleRemove} />
          </div>
        )}
      </div>
    )
  }

  const logOutForm = () => (
    <form onSubmit={handleLogout}>
      <button>
        logout
      </button>
    </form>
  )

  return (
    <div>

      <Notification message={successMessage} classType="success" />
      <Notification message={errorMessage} classType="error" />
      <h2>Blogs</h2>
      {user === null ?
        loginForm() :
        <div>
          <span>
            {user.name} logged in
            {logOutForm()}
          </span>
          {addBlogForm()}
        </div>
      }

      {listBlogs()}
    </div>
  )

}


export default App