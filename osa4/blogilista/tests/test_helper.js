const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
      title: 'firstBlog',
      author: 'firstAuthor',
      url: 'first.com',
      likes: 0,
      user: '60f98cc929733b798d5caafa'
    },
    {
      title: 'secondBlog',
      author: 'secondAuthor',
      url: 'second.com',
      likes: 1,
      user : '60f98cc929733b798d5caafa'
    },
  ]

  const initialUsers = [
      {
          username: 'tester',
          name: 'tester',
          id: '60f98cc929733b798d5caafa'
      }
  ]

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
  }

  module.exports = {
    initialBlogs, initialUsers, blogsInDb, usersInDb, 
  }