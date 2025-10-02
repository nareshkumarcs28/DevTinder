const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");

app.use(express.json());
// sign up 
app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send("Email already exists!");
        } else {
            res.status(400).send("Error saving the user: " + err.message);
        }
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

// DELETE api 
app.delete("/user", async (req, res) => {
    const userId = req.body.userId; //User.find({emailId:req.body.emailId})
    try {
        // const user = await User.findByIdAndDelete({ _Id: userId});
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfullly!")

    } catch (err) {
        res.status(400).send("something went wrong ");
    }
});

//update data of the user 
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
        console.log(user);
        res.send("User updated successfullly!");

    } catch (err) {
        res.status(400).send("something went wrong ");
    }
});




connectDB().then(() => {
    console.log("Database connection established ......")
    app.listen(7777, () => {
        console.log("running on port 7777......");
    });

}).catch(err => {
    console.error("Database  not be established ......")
})

