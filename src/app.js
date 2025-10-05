const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");

app.use(express.json());

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
            throw new Error("Email id not valid ");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {
            res.send("Login successfully!!!!!!")
        }
        else {
            throw new Error("Password not valid");

        }

    } catch (err) {
        res.status(400).send("Error :" + err.message)
    }
})
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

