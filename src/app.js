const express = require("express");
const connectDB=require("./config/dataabase")
const app = express();
const User = require("./models/user");

app.post("/signup" , async (req,res)=>{
    // creating a new instance  of the user model
   const user= new User({
    firstName:"Najay",
    lastname:"Kumar",
    emailId:"narfgumar@gmail.com",
    password:"Narde@12",
   });

await user.save();
res.send("User added successfully");


})




connectDB().then(()=>{
    console.log("Database connection established ......")
    app.listen(7777, () => {
    console.log("running on port 7777......");
});

}).catch(err=>{
     console.error("Database  not be established ......")
})

