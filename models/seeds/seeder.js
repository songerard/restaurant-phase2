// set mongodb connection
const mongoose = require('mongoose')
const Restaurant = require('../restaurant')   // load restaurant model
mongoose.connect('mongodb://localhost/restaurant')
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
    Restaurant.create({
      name: seed.name,
      name_en: seed.name_en,
      category: seed.category,
      image: seed.image,
      location: seed.location,
      phone: seed.phone,
      google_map: seed.google_map,
      rating: seed.rating,
      description: seed.description
    })
  })
  console.log('seeder done')
})