const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('author', { username:1, name:1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.post('/', async (request, response, next) => {
  // const blog = new Blog(request.body)
  // console.log('req.body',request.body)

  // blog
  //   .save()
  //   .then(result => {
  //     response.status(201).json(result)
  //   })

  const blogBody = request.body

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing os invalid'})
    }

    const user = await User.findById(decodedToken.id)

    console.log('req.body',request.body, 'User:', user)
  
    const blog = new Blog({
      title: blogBody.title,
      author: user._id,
      url: blogBody.url,
      likes: blogBody.likes || 0,
    })
  
    const savedBlogPost = await blog.save()
    user.blogs = user.blogs.concat(savedBlogPost._id)
    await user.save()
    response.status(201).json(savedBlogPost.toJSON())
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter