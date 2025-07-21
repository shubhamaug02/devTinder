const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth ,async (req,res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowed_status = ['interested', 'ignored'];
        const isValidStatus = allowed_status.includes(status);
        if(!isValidStatus){
            throw new Error("Invalid status !!");
        }
        const toUser = await User.findById(toUserId);
        
        if(!toUser){
            res.status(404).send({message: 'User Not Found'});
            return;
        }

        data = {
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        }
        
        const connectionRequest = new ConnectionRequest(data);

        const isConnectionExists = await ConnectionRequest.findOne({$or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]});

        if(isConnectionExists){
            throw new Error("Connection Already Exists !!");
        }
        const responseData = await connectionRequest.save();
        res.json({message: "Connection request sent !!", data: responseData});
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;