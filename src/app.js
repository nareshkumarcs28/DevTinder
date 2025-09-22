const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

// Protect all routes starting with /admin


app.listen(7777, () => {
    console.log("running on port 7777......");
});
