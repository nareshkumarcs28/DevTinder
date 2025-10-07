const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth}=require("./middlewares/auth")

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
            const token = await jwt.sign({ _id: user._id }, "DEVTINDRER@47687",{
                expiresIn:"1d"
            });
            

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
app.get("/profile" , userAuth,async (req, res) => {
    try {
      
        const user = await req.user;
        
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }

});

app.post("/sendConnectionRequest",userAuth, async (req,res) =>{
    const user= req.user;
    // sending a connection request 
    console.log("sending a connection request");
    res.send( user.firstName+" Request Sent! ")
})




connectDB().then(() => {
    console.log("Database connection established ......")
    app.listen(7777, () => {
        console.log("running on port 7777......");
    });

}).catch(err => {
    console.error("Database  not be established ......")
})

