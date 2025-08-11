const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();
const sendEmail = require('../utils/sendEmail');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowed_status = ['interested', 'ignored'];
        const isValidStatus = allowed_status.includes(status);
        if (!isValidStatus) {
            throw new Error("Invalid status !!");
        }
        const toUser = await User.findById(toUserId);

        if (!toUser) {
            res.status(404).send({ message: 'User Not Found' });
            return;
        }

        data = {
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        }

        const connectionRequest = new ConnectionRequest(data);

        const isConnectionExists = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (isConnectionExists) {
            throw new Error("Connection Already Exists !!");
        }
        const responseData = await connectionRequest.save();

        const emailRes = await sendEmail.run();
        console.log(emailRes);

        res.json({ message: "Connection request sent !!", data: responseData });
    }
    catch (err) {
        console.log(err);
        res.status(400).send("ERROR: " + err.message);
    }
});

//api to accept or reject the request by the loggedin user
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try {
        const { status, requestId } = req.params;
        // 1. Validate status
        const allowed_status = ['accepted', 'rejected'];
        if (!allowed_status.includes(status)) {
            return res.status(400).json({ message: "Invalid Status !!" });
        }

        // 2. validate the requestId 
        // 3. the interested status can only be accepted
        // 4. The loggedinUser must be toUserId in the connectionrequest.

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection Request not found !!" });
        }

        connectionRequest.status = status;
        const responseData = await connectionRequest.save();
        res.json({ message: `${loggedInUser.firstName} ${status} the connection request`, data: responseData });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;