/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog, { BlogTitle } from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import LoginForm from './components/LogInForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { Table, Navbar, Nav } from 'react-bootstrap'

import {
  BrowserRouter as Router,
  Switch, Route, useParams, Link
} from 'react-router-dom'

import { initializeUsers } from './reducers/usersReducer'
import { setUser } from './reducers/userReducer'
import { initializeBlogs, createBlog, removeBlog, likeBlog } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'



const Menu = ( { user, loginForm, logOutForm } ) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">

          <Nav.Link href="#" as="span">
            <Link style={padding} to="/">blogs</Link>
          </Nav.Link>

          <Nav.Link href="#" as="span">
            <Link style={padding} to="/users">users</Link>
          </Nav.Link>

          {user === null ?
            <Nav.Link href="#" as="span">
              {loginForm()}
            </Nav.Link>
            :
            <Nav.Link href="#" as="span">
              {user.name} logged in
              {logOutForm()}
            </Nav.Link>
          }


        </Nav>
      </Navbar.Collapse>
    </Navbar>

  )
}

const Users = ( { users } ) => {
  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <td></td>
            <th>blogs created</th>
          </tr>
          {users.map(user => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const Home = ( { user, addBlog, listBlogs } ) => {
  return (
    <div>
      {user === null ?
        null :
        <div>
          {addBlog()}
        </div>
      }
      {listBlogs()}
    </div>
  )
}

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find(n => n.id === id)
  if(!user) {
    return null
  }
  return (
    <div>
      <h1>{user.name}</h1>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id} >
            {blog.title}
          </li>
        )}

      </ul>
    </div>
  )
}


const BlogPage = ( { user, blogs, handleLike, handleRemove } ) => {
  const id = useParams().id
  const blog = blogs.find(n => n.id === id)

  if(!blog) {
    return null
  }

  return <Blog blog={blog} user={user} handleLike={handleLike} handleRemove={handleRemove}/>
}

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector(state => state.user)

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')

      dispatch(setNotification(
        'Login successful!', 3))

    } catch (error) {
      dispatch(setNotification('wrong credentials', 3))
    }
  }

  const handleLike = async (event) => {
    event.preventDefault()
    dispatch(likeBlog(event.target.value))

  }


  const addBlog = async (blogObject) => {
    try {

      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))

      dispatch(setNotification(
        `Blog '${blogObject.title} by '${blogObject.author}' added!`, 3))

    }
    catch(error) {
      dispatch(setNotification('Validation error, blog not added.', 3))
    }
  }

  const handleRemove = async (event) => {
    const id = event.target.value
    try {
      const blog = await blogs.find(blog => blog.id===id)
      if(window.confirm(`Remove '${blog.title}' by '${blog.author}'?`)) {
        dispatch(removeBlog(blog.id))
      }
    }
    catch(error) {
      console.log(error.message)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    dispatch(setUser(null))
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
        <Table striped>
          <tbody>
            {sortedBlogs.map(blog =>
              <tr id='single-blog' key={blog.id}>
                <Link to={`blogs/${blog.id}`}><BlogTitle blog={blog} /></Link>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }

  const logOutForm = () => (
    <form style={{ display:'inline', margin: '5px'  }}  onSubmit={handleLogout}>
      <button>
        logout
      </button>
    </form>
  )

  return (
    <div className="container">
      <Router>
        <Menu user={user} loginForm={loginForm} logOutForm={logOutForm} />
        <Notification classType="success" />
        <div>
          <h2>Blogs</h2>
        </div>

        <Switch>


          <Route path="/users/:id">
            <User users={users} />
          </Route>

          <Route path="/users">
            <Users users={users} />
          </Route>

          <Route path="/blogs/:id">
            <BlogPage user={user} blogs={blogs} handleLike={handleLike} handleRemove={handleRemove}/>
          </Route>

          <Route path="/">
            <Home user={user} addBlog={addBlogForm} listBlogs={listBlogs} />
          </Route>

        </Switch>
      </Router>
    </div>
  )

}


export default App