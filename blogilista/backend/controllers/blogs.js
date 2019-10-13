const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  // const blog = new Blog(request.body)
  // console.log('req.body',request.body)

  // blog
  //   .save()
  //   .then(result => {
  //     response.status(201).json(result)
  //   })

  const blogBody = request.body
  console.log('req.body',request.body)
  
  const blog = new Blog({
    title: blogBody.title,
    author: blogBody.author,
    url: blogBody.likes,
    likes: 0
  })
  
  try {
    const savedBlogPost = await blog.save()
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