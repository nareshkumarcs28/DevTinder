const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

// Protect all routes starting with /admin
app.get("/admin", adminAuth);


app.post("/user/login", (req, res) => {
    res.send("User logged in successfully!");
});

app.get("/user/data", userAuth, (req, res) => {
    res.send("User data sent");
});

app.get("/user/getAllData", (req, res) => {
    res.send("All Data sent");
});

app.get("/user/deleteUser", (req, res) => {
    res.send("Deleted A user");
});

app.listen(7777, () => {
    console.log("running on port 7777......");
});
