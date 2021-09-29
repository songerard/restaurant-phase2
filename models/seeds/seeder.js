// set mongodb connection
const mongoose = require('mongoose')
const Restaurant = require('../restaurant')   // load restaurant model
mongoose.connect('mongodb://localhost/restaurant-list')
const db = mongoose.connection

// get restaurant seeder json
const restaurantSeeder = require('../../restaurant.json')

// if mongodb connection error
db.on('error', () => {
  console.log('mongodb error!')
})

// once mongodb connected
db.once('open', () => {
  console.log('mongodb connected!')

  // insert seeder into mongodb
  restaurantSeeder.results.forEach(seed => {
    const {
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    } = seed
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
  })
  console.log('seeder done')
})