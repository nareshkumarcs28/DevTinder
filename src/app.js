const express = require("express");
const app = express();



app.get("/user", (req,res)=>{
    res.send("im GET testing");
});
app.post("/user", (req,res)=>{
    res.send("im POST testing");
});


app.patch("/user", (req,res)=>{
    res.send("im PATCH testing");
});


app.delete("/user", (req,res)=>{
    res.send("im DELETE testing");
});





app.listen(3000,()=>{
    console.log("running on port 3000......");
});;