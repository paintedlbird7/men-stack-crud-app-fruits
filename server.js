// Here is where we import modules
// We begin by loading Express
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
// initialize the express application
const express = require("express");
const app = express();
const mongoose = require("mongoose"); // require package

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
console.log('Mongo URI:', process.env.MONGO_URI); // Debugging line

  // Import the Fruit model
const Fruit = require("./models/fruit.js");

  // body parser middleware: this function roads the req body and decodes it into req.body so we can access 
  // form data
app.use(express.urlencoded({ extended: false }));

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /fruits index route sends a page that lists all fruits from the database
app.get("/fruits", async (req, res) => {
    const allFruits =