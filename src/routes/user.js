const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const Users = require('../models/user');

const userRouter = express.Router();

const USER_SAFE_FIELDS = 'firstName lastName age gender about imageUrl skills';

userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }). populate('fromUserId', USER_SAFE_FIELDS);
        // .populate('fromUserId', ['firstName', 'lastName']);

        res.json({message: 'Requests fetched Successfully !!', data: connectionRequests});
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// get all the connections and their information
userRouter.get("/user/connections", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}],
            status: 'accepted'
        }). populate('fromUserId', USER_SAFE_FIELDS)
        . populate('toUserId', USER_SAFE_FIELDS);

        const data = connectionRequests.map(row => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.send(data);
    }
    catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
});

userRouter.get("/feed", userAuth, async (req,res) => {
    try{
        //Get all the users except
        // 0. The user himself
        // 1. The users to whom the user has sent the request or ignored.
        // 2. The users from whom the user has recieved the request
        // 3. The users who are already a connection.

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50 : limit;
        const skip = (page-1)*limit;
        
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach(row => {
            hideUserFromFeed.add(row.fromUserId.toString());
            hideUserFromFeed.add(row.toUserId.toString());
        });

        const users = await Users.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) }},
                {_id: {$ne: loggedInUser._id}}
            ]
        })
        .select(USER_SAFE_FIELDS)
        .skip(skip)
        .limit(limit);


        res.send(users);
    }
    catch(err) {
        res.status(400).send({message: "ERROR: " +err.message});
    }
});

module.exports = userRouter;