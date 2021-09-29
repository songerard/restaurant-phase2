// require express
const express = require('express')
const app = express()

// require mongodb and connect db 'restaurant-list'
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list')
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// load restaurant model
const Restaurant = require('./models/restaurant')


// set express-handlebars as view engine
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set port
const port = 3000

// // get restaurant data from json
// const restaurantList = require('./restaurant.json')

// use static files
app.use(express.static('public'))

// set route
// index page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// show restaurant details page
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// search restaurant
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const restaurants = restaurantList.results.filter(r => r.name.toLowerCase().includes(req.query.keyword.toLowerCase()) || r.category.toLowerCase().includes(req.query.keyword.toLowerCase()))

  if (!restaurants.length || !keyword) {
    // if no restaurant found
    res.render('index', { restaurant: restaurantList.results, keyword: keyword, searchAlert: true })
  } else {
    // if some restaurants found
    res.render('index', { restaurant: restaurants, keyword: keyword, searchAlert: false })
  }
})

// set listen to localhost:3000
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`)
})