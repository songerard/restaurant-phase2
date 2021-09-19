// require express
const express = require('express')
const app = express()

// set express-handlebars as view engine
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set port
const port = 3000

// get restaurant data from json
const restaurantList = require('./restaurant.json')

// use static files
app.use(express.static('public'))

// set route
// index page
app.get('/', (req, res) => {
  res.render('index', { restaurant: restaurantList.results })
})

// show restaurant details page
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(r => r.id === Number(req.params.id))
  res.render('show', { restaurant: restaurant })
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