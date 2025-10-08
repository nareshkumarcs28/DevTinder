const express = require('express');
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();


// signup api 
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("invalid crediential");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {

            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            })

            res.send("Login successfully!!!!!!")
        }
        else {
            throw new Error("invalid crediential");
        }

    } catch (err) {
        res.status(400).send("Error :" + err.message)
    }
});

// logout api
authRouter.post("/logout", async (req, res)=>{
res.cookie("token", null,{
    expires: new Date(Date.now())
})
res.send("logout successfully!!!1");
})


module.exports= authRouter;