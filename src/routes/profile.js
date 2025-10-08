const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

// Profile view API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user; // no need for await
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// Profile edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req); // should throw error if invalid

        const loggedInUser = req.user;

        // Update only keys present in request body
        Object.keys(req.body).forEach(key => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully!`,
            data: loggedInUser
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = profileRouter;
