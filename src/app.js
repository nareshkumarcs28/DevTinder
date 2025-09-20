const express = require("express");
const app = express();

// app.use("", (req,res)=>{
//     res.send("Namaste Naresh");
// });

app.use("/test", (req,res)=>{
    res.send("Namaste Naresh i am testing");
});

app.use("/hello", (req,res)=>{
    res.send("hello Naresh")
});

app.listen(3000,()=>{
    console.log("running on port 3000......");
});;