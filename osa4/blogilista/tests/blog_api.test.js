const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenExtractor } = require('../utils/middleware')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'test', passwordHash })

  await user.save()
})

async function logInUser() {
  const creds = {
    username: 'test',
    password: 'sekret'
    }
  const auth = await api
  .post('/api/login')
  .send(creds)

  return `bearer ${auth.body.token}`

}

test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

test('returned content is JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('blogs are identified by id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()  
    expect(response.body[1].id).toBeDefined()
})
  
describe('user auth required: single user in db', () => {
        

test('a new blog can be added (valid token)', async () => {
    const newBlog =
        {
          title: 'newBlog',
          author: 'newAuthor',
          url: 'new.com',
          likes: 0,
          user: (await User.findOne({}, { array: { $slice: 1 } }))._id
        }  

    const authKey = await logInUser()

    await api
    .post('/api/blogs')
    .set('Authorization', authKey)
    .send(newBlog)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

})

test('a new blog cannot be added if no token in request', async () => {
    const newBlog =
        {
          title: 'newBlog',
          author: 'newAuthor',
          url: 'new.com',
          likes: 0,
          user: (await User.findOne({}, { array: { $slice: 1 } }))._id
        }  

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

})

test('likes are defaulted to 0 in valid posts', async () => {
    const newBlog =
    {
      title: 'newBlogNoLikes',
      author: 'newAuthor',
      url: 'new.com',
      user: (await User.findOne({}, { array: { $slice: 1 } }))._id
     }

     const authKey = await logInUser()


    await api
    .post('/api/blogs')
    .set('Authorization', authKey)
    .send(newBlog)
    
    const response = await api.get('/api/blogs')
    expect(response.body[response.body.length - 1].likes).toBe(0)
})

test('blogs without title and url are responded with 400', async () => {
    const newBlog =
    {
      author: 'newAuthor',
      likes: 3,
      user: (await User.findOne({}, { array: { $slice: 1 } }))._id
    }

    const authKey = await logInUser()

    await api
    .post('/api/blogs')
    .set('Authorization', authKey)
    .send(newBlog)
    .expect(400)
    
})
})
  afterAll(() => {
    mongoose.connection.close()
  })