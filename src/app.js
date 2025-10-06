const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser())
// sign up 
app.post("/signup", async (req, res) => {
    try {
        // Validation of data
        validateSignUpData(req);

        const { firstName, lastName, password, emailId } = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,

        });
        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

// login api
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("invalid crediential");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            // create a JWT Token
            const token = await jwt.sign({ _id: user._id }, "DEVTINDRER@47687");
            console.log(token);

            // add the token to cookie and send the response back to the user 

            res.cookie("token", token)

            res.send("Login successfully!!!!!!")
        }
        else {
            throw new Error("invalid crediential");
        }

    } catch (err) {
        res.status(400).send("Error :" + err.message)
    }
});
// profile api
app.get("/profile", async (req, res) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Invalid Token");
        }
        const deocodedMessage = await jwt.verify(token, "DEVTINDRER@47687");
        const { _id } = deocodedMessage;
       
        const user = await User.findById(_id)
        if(!user){
             throw new Error("Login Again");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send("something went wrong ");
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
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;


    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not Allowed");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });
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

