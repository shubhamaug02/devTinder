const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminAuth = (req,res,next) => {
    const token ="xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Access !!");
    }
    else {
      next();
    }
};

// const userAuth = (req,res,next) => {
//     const token ="xyz";
//     const isUserAuthorized = token === "xyz";
//     if(!isUserAuthorized){
//         res.status(401).send("Unauthorized Access !!");
//     }
//     else {
//       next();
//     }
// };

const userAuth = async (req,res,next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            res.status(401).send("Invalid Token !!!");
        }

        const decodedObj = jwt.verify(token, "DEV@TINDER$007");
        const {_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user) {
            throw new Error("User Not Found");
        }

        req.user = user;
        next();
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
}

module.exports ={
    adminAuth,
    userAuth
};