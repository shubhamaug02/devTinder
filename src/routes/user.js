const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

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

module.exports = userRouter;