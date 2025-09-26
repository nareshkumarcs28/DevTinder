const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");

app.use(express.json());

    // signup api
app.post("/signup", async (req, res) => {
    // creating a new instance  of the user model
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        res.status(400).send("Error saving the user :" + err.message);
    }

});
// GET user byy email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId; //User.find({emailId:req.body.emailId})
    try {
        const users = await User.findOne({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("user not found ");
        }
        else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("something went wrong ");
    }
});

//Feed API - GET /feed - get all the users from the database 
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (err) {
        res.status(400).send("something went wrong ");
    }
})



connectDB().then(() => {
    console.log("Database connection established ......")
    app.listen(7777, () => {
        console.log("running on port 7777......");
    });

}).catch(err => {
    console.error("Database  not be established ......")
})

