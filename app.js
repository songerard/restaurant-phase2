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

// require body-parser
const bodyParser = require('body-parser')
app.use(express.urlencoded({ extended: true }))

// set port
const port = 3000

// use static files
app.use(express.static('public'))

// set listen to localhost:3000
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`)
})

// set common variable
let allCategory = []
let selectedRestaurantCategory = ''

// register new handlebars function
let hbs = exphbs.create({})
hbs.handlebars.registerHelper('if_eq', function (a, options) {
  if (a === selectedRestaurantCategory) {
    return options.fn(this)
  }
})

// set route
// index page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ 'rating': 'desc', 'name': 'asc' })
    // update category list
    .then(restaurants => {
      allCategory = []      // clear allCategory list
      restaurants.forEach(r => {
        // if category not found in allCategory, then add in allCategory
        if (allCategory.indexOf(r.category) === -1) {
          allCategory.push(r.category)
        }
      })
      allCategory.sort
      res.render('index', { restaurants })
    })
    .catch(error => console.error(error))
})

// new restaurant page
app.get('/restaurants/new', (req, res) => {
  Restaurant.find()
    .lean()
    .then(res.render('new', { allCategory }))
    .catch(error => console.error(error))
})

// add new restaurant into mongodb
app.post('/restaurants', (req, res) => {
  let {
    name,
    name_en,
    category,
    other_category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  } = req.body

  category = (category === '其他') ? other_category : category

  Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  })
    .then(() => res.redirect('/'))
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
    .sort({ 'rating': 'desc', 'name': 'asc' })
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
    .sort({ 'rating': 'desc', 'name': 'asc' })
    .then(filteredRestaurants => {
      // if no restaurant found, then set alert = true and show all restaurants
      const searchAlert = (!filteredRestaurants.length || !keyword) ? true : false
      const restaurants = (filteredRestaurants.length) ? filteredRestaurants : allRestaurants

      // render index page
      res.render('index', { restaurants, keyword, searchAlert })
    })
    .catch(error => console.error(error))
})

// edit restaurant page
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .then(restaurant => {
      selectedRestaurantCategory = restaurant.category
      res.render('edit', { restaurant, allCategory })
    })
    .catch(error => console.error(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => {
      Object.assign(restaurant, req.body)
      // update category if "Other category" exist
      restaurant.category = (req.body.other_category) ? req.body.other_category : restaurant.category
      restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

// delete restaurant
app.post('/restaurants/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})