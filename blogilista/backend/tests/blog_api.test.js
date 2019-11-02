/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('When there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'pate',
      name: 'Patrick Pitkänen',
      password: 'Salakala'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  })

  test('creation fails with proper statuscode and message if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Super Looser',
      password: 'Secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username´ to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

beforeEach(async () => {
  await Blog.remove({})
  
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('new blog post can be saved', async () => {
  const newBlogpost = {
    title: "New Blog Post",
    author: "Me, Myself & I",
    likes: 999
  }

  await api
    .post('/api/blogs')
    .send(newBlogpost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  console.log('blogs:', blogsAtEnd)
  
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  console.log('blog titles:',titles)
  
  expect(titles).toContain(
    'New Blog Post'
  )
})