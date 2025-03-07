// Here is where we import modules
// We begin by loading Express
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
// initialize the express application
const express = require("express");
const app = express();
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");


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
  // form data // Mount it along with our other middleware, ABOVE the routes
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));


// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /fruits index route sends a page that lists all fruits from the database
app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find({});
    console.log(allFruits); // log the fruits!
    // res.send("Welcome to the index page!");
    res.render("fruits/index.ejs", { fruits: allFruits });

  });
  
// GET /fruits/new
app.get("/fruits/new", (req, res) => {
    // res.send("This route sends the user a form page!");
    // never add a trailing slash with render
    res.render("fruits/new.ejs"); // relative file path
});

app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
});

// POST /fruits Path used to receive form submissions
app.post("/fruits", async (req, res) => {
    // conditional logic to handle the default behavior of HTML form checkbox fields
    // we do this when we need a boolean instead of a string
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }

    try {
        // create the data in our databaase
        const newFruit = await Fruit.create(req.body);
        console.log("New fruit saved:", newFruit); // ✅ Logs the saved fruit
        res.redirect("/fruits"); // URL path / Redirect to the fruits index page 
    // redirect tells the client to navigate to a new url path/another page
    } catch (error) {
        console.error("Error saving fruit:", error); // ❌ Logs errors
        res.status(500).send("Error saving fruit");
    }
});

app.delete("/fruits/:fruitId", async (req, res) => {
  // res.send("This is the delete route");
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
}); 

// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});

// server.js

app.put("/fruits/:fruitId", async (req, res) => {
  console.log('Updated fruit data:', req.body);
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  // await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
  const updatedFruit = await Fruit.findByIdAndUpdate(req.params.fruitId, req.body, { new: true });
console.log('Updated fruit:', updatedFruit);


  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});

  
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
