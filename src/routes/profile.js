const express = require('express');
const bcrypt = require('bcrypt');
const {adminAuth,userAuth} = require('../middlewares/auth');
const {validateEditData,validateKeysForPasswordUpdate, validatePasswordIsStrong} = require('../utils/validateData');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req,res) => {
    try {
        const user = req.user;

        res.send(user);
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {

    try {
        if(!validateEditData(req)){
            throw new Error("Some Fields are uneditable");
        }

        const loggedInUser = req.user;

        // req.body items in loggedinuser
         console.log(loggedInUser);
        Object.keys(req.body).forEach(key => loggedInUser[key]=req.body[key]);
        console.log(loggedInUser);

        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your data is updated successfully !!`,
            data: loggedInUser
        });
    }
    catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
    validateEditData(req);
});


//update Password -- provide the old password and new password
profileRouter.patch("/profile/password", userAuth, async (req,res) => {

    try {
        const {oldPassword, password} = req.body;
        
        const allNeededFieldsPresent = validateKeysForPasswordUpdate(req);

        if(!allNeededFieldsPresent){
            throw new Error("Provide the old and new password !!");
        }

        const user = req.user;
        const isOldPasswordCorrect = await user.validatePassword(oldPassword);
        if(!isOldPasswordCorrect){
            throw new Error("Old Password is wrong !!");
        }

        if(!validatePasswordIsStrong(password)){
            throw new Error("Weak Password");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        user.password = passwordHash;
        await user.save();
        res.send("password updated");
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
    
});

module.exports = profileRouter;