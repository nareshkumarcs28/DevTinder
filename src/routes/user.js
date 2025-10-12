const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const User = require("../models/user");


const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl"
//Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)
        // populate("fromUserId", ["firstName","lastName","age","gender"])

        res.json({
            message: "Data  fetched successfully",
            data: connectionRequest,
        })


    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);;

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.toUserId;

        }
        );

        res.json({ data });



    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // User should see all the user cards except:
        // 1. their own profile
        // 2. existing connections
        // 3. ignored people
        // 4. already sent or received connection requests

        const loggedInUser = req.user;

        // Find all connection requests (sent or received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
        }).select("fromUserId toUserId");

        // Collect users to hide from feed
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // Fetch users not in the hide list
        const users = await User.find({
          $and:[
            {  _id: { $nin: Array.from(hideUsersFromFeed) }},
            {_id: { $ne: loggedInUser._id}}
          ]
        }).select(USER_SAFE_DATA);

        res.send(users)

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;