const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/',  middleware.userExtractor, async (request, response) => {
    const body = request.body

    const user = body.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog.toJSON())
    })

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)
  blog.comments.push(body.comment)
  
  await blog.save()
  // const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  
  response.json(blog.toJSON())
  
  })

blogsRouter.delete('/:id', middleware.userExtractor ,async (request, response) => {
        const body = request.body

        const user = body.user

        const blog = await Blog.findById(request.params.id)

        if(blog.user.toString() === user.id.toString()) {
            await Blog.deleteOne(blog)
            response.status(204).end()  
        } else {
            return response.status(401).json({ error: 'you cant delete other peoples posts' })    
        }


  })
  
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      }

        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedBlog.toJSON())
  })


  module.exports = blogsRouter