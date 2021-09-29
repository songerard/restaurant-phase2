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

  // get all restaurants from mongodb
  const allRestaurants = []
  Restaurant.find()
    .lean()
    .then(restaurants => {
      allRestaurants.push(...restaurants)
    })

  // filter restaurants by keyword in name or category
  Restaurant.find({
    $or: [
      { 'name': { "$regex": keyword, "$options": "i" } },
      { 'category': { "$regex": keyword, "$options": "i" } }
    ]
  })
    .lean()
    .then(filteredRestaurants => {
      // if no restaurant found, then set alert = true and show all restaurants
      const searchAlert = (!filteredRestaurants.length || !keyword) ? true : false
      const restaurants = (filteredRestaurants.length) ? filteredRestaurants : allRestaurants

      // render index page
      res.render('index', { restaurants, keyword, searchAlert })
    })
    .catch(error => console.error(error))
})

// set listen to localhost:3000
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`)
})