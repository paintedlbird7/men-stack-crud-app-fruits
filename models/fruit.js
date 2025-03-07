// models/fruit.js

const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
  name: String,
  isReadyToEat: Boolean,
});
const Fruit = mongoose.model("Fruit", fruitSchema); // create model

module.exports = Fruit;
// this module eports teh fruit model
// fruit model provides us with full crud functionality over our fruits collection in the fruits-app database
