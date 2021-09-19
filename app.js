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

// set listen to localhost:3000
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`)
})