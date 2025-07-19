const express = require('express');
const {adminAuth,userAuth} = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth ,(req,res) => {
    try {
        res.send("Connection request sent !!");
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;