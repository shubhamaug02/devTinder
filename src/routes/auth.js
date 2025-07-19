const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');

const User = require('../models/user');
const {validateData} = require("../utils/validateData"); 
const {adminAuth,userAuth} = require('../middlewares/auth');


const authRouter = express.Router();

authRouter.post("/signup", async (req,res) => {

    try {
         // validate the data
        validateData(req.body);
        // encrypt the password

        const { firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const userData = req.body;

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        }); 
        await user.save();
        res.send("User Added Successfully !!");
    }
    catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
   
});

authRouter.post("/login", async (req,res) => {

    try {
        const {emailId, password} = req.body;

        if(!validator.isEmail(emailId)){
            throw new Error("Invalid emailId ");
        }

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid Credentials !!");
        }

        const isHashMatched = user.validatePassword(user.password);
        if(isHashMatched) {
            const token = user.getJWTToken();
            res.cookie('token', token, {expires: new Date(Date.now() + 8 * 3600000)});
            res.send("Login Successful !!!!");
        }
        else {
            throw new Error("Invalid Credentials !!!");
        }
    }
    catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", (req,res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successful !!");
});

module.exports = authRouter;