const express = require("express");
const app = express();



// app.get("/user", (req,res)=>{
//     res.send({ fisrtName:"naresh", lastName:"Kumar"});
// });

app.get("/user", (req,res, next)=>{
    console.log(" running 1")
    // res.send("hello i am user1");
    next();
},
(req,res, next)=>{
    console.log(" running 2")
    // res.send("hello i am user1");
     next();
},
(req,res, next)=>{
    console.log(" running 3")
    // res.send("hello i am user1");
     next();
},
(req,res, next)=>{
    console.log(" running 4")
    res.send("hello i am user4");
    
}
);
app.listen(3000,()=>{
    console.log("running on port 3000......");
});;