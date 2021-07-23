var _ = require('lodash');
const { flow, countBy, toPairs, maxBy, tail } = _
const User = require('../models/user')  

const dummy = (blogs) => {
    return(1);
  }

const totalLikes = (blogs) => {
  return(blogs.map(blogs => blogs.likes).reduce((a,b) => a+b, 0))
}

const favoriteBlog = (blogs) => {
  const result = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
  return(result)
}


const mostBlogs = (blogs) => {

  // source & idea from: https://stackoverflow.com/a/61914757
  const fn = flow(
    arr => countBy(blogs, 'author'), 
    toPairs,
    arr => maxBy(arr, tail)
  )

  const result = fn(blogs)
  
  return({
    'author': result[0],
    'blogs': result[1]
  })
  }

const mostLikes = (blogs) => {

  // source & idea from: https://stackoverflow.com/a/45287338
  const result = _(blogs)
  .groupBy('author')
  .map((platform, id) => ({
    author: id,
    likes: _.sumBy(platform, 'likes'),
  }))
  .value()

  return(favoriteBlog(result))
}



  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikes,
    mostBlogs,
  }

