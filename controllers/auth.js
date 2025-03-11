const express = require("express");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const router = express.Router();
const User = require("../models/fruit.js"); // Ensure correct model import

// GET /auth/sign-up - Show the signup form
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs"); // Make sure this file exists in your views/auth folder
});

// POST /auth/sign-up - Handle signup form submission
router.post("/sign-up", async (req, res) => {
    try {
        // Check if passwords match
        if (req.body.password !== req.body.confirmPassword) {
            return res.send("Password and Confirm Password must match");
        }

        // Check if the username is already in the database
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.send("Username already taken.");
        }

        // Hash the password before saving to the database
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;

        // Validation logic - Create the new user in the database
        const user = await User.create(req.body);

        // Send a confirmation message to the user
        res.send(`Thanks for signing up ${user.username}`);
    } catch (error) {
        res.status(500).send("Error signing up user");
    }
});

module.exports = router;
