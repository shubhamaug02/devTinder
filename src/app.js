const express = require('express');

// const {adminAuth,userAuth} = require('./middlewares/auth');
const connectDB = require('./config/database');
const app = express();

const User = require('./models/user');
const {validateData} = require("./utils/validateData"); 

const validator = require('validator');
const bcrypt = require('bcrypt');

// Request Handlers with app.use

/** 
app.use("/",(req, res) => {
    res.send("Hello, This is express server's response");
});

app.use("/hello", (req,res) => {
    res.send("Hello, Hello, Hello !!");
});

app.use('/test',(req,res) => {
    res.send("Hello, responding to the test url request");
});
*/


// app.use at top with HTTP method request will serve the request first for all the methods

// app.use("/",(req, res) => {
//     res.send("Hello, This is express server's response");
// });

// Request Handlers with http method

// Reading url parameters

/** 
app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({"firstname": "Shubham", "lastname": "Patel"});
});

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({"firstname": "Shubham", "lastname": "Patel"});
});

app.post("/user", (req,res)=> {
    res.send("Data saved successfuly for the POST request!!");
});


app.delete("/user" , (req,res) => {
    res.send("DELETE Request succeeded !!");
});

app.put("/user", (req,res) => {
    res.send("PUT Request response");
});

app.patch("/user", (req,res) => {
    res.send("PATCH Request response");
});

*/


// Mutiple Request Handlers

/**
app.use("/multiple", (req, res, next) => {
    console.log("Route Handler 1");
    // res.send("Response");
    next();
}, (req,res,next) => {
    console.log("Route Handler 2");
    // res.send("Response 2");
    next();
},
(req,res,next) => {
    console.log("Route Handler 3");
    // res.send("Response 3");
    next();
},
(req,res,next) => {
    console.log("Route Handler 4");
    // res.send("Response 4");
    next();
},
(req,res,next) => {
    console.log("Route Handler 5");
    res.send("Response 5");
    next();
});
*/


/** 
app.use("/admin", adminAuth);

app.use("/user/login", (req,res) => {
    res.send("user Login");
})

app.get("/user/data", userAuth, (req,res)=> {
    res.send("User Data Sent !!");
});

app.get("/admin/getAllData", (req,res) => {
    console.log("admin data getting send");
    res.send("Admin Data Sent !!");
});

app.delete("/admin/deleteAdminData", (req,res) => {
    console.log("Deleting admin Data");
    res.send("Admin Data Deleted");
});

*/

// Error Handling

// We should try/catch for error handling and also put the app.use("/", () => {}) at the end for the errors to catch
// As there could be code which does not have try/catch

/** 
app.get("/getUserData", (req,res) => {
    try {
        throw new Error("djgddghd");
        res.send("Data Sent");
    }
    catch(e){
         res.status(500).send("some error getting data");
    }
    
});

app.use("/", (err,req,res,next) => {
    if(err) {
        res.status(500).send("Something went wrong");
    }
});

*/


// POST request signup

// middleware to read JSON
app.use(express.json());

app.post("/signup", async (req,res) => {

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

app.post("/login", async (req,res) => {

    try {
        const {emailId, password} = req.body;

        if(!validator.isEmail(emailId)){
            throw new Error("Invalid emailId ");
        }

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid Credentials !!");
        }

        const isHashMatched = await bcrypt.compare(password, user.password);
        if(isHashMatched) {
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

app.get("/user", async (req,res) => {
    try {
        const user = await User.find({emailId: req.body.emailId});
        // const user = await User.findById('68734f661f10ff34c5d1229f');
        if(user.length ===0){
            res.status(404).send("No user Found with emailId");
        } else {
            res.send(user);
        }
    }
    catch(err) {
        res.status(400).send("Something went wrong");
    }
});

app.delete("/user", async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId);
        res.send("User deleted successfully !!");
    }
    catch(err) {
         res.status(400).send("Something went wrong");
    }
});

app.patch("/user/:userId", async (req,res) => {

    try {
        const ALLOWED_UPDATES = [
            "userId", "imageUrl", "age", "gender", "about", "skills"
        ];

        const data = req.body;
        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not Allowed !!");
        }

        const skills = data?.skills;
        if(skills.length >10){
            throw new Error("No more than 10 skills allowed");
        }

       const user = await User.findByIdAndUpdate(req.params?.userId, req.body, {returnDocument: 'after', runValidators: true} );
    // Update by the emailId
    //    const user = await User.findOneAndUpdate({emailId: req.body.emailId}, req.body, {returnDocument: 'after'} );
       console.log(user);
       res.send("User updated successfully !!");
    }
    catch (err){
        res.status(400).send("Update Failed " + err.message);
    }
})

app.get("/feed", async (req,res) => {
    try {
      const users = await User.find({});
      if(users.length===0){
        res.status(404).send("No users found in the collection");
      }
      else {
        res.send(users);
      }
    }   
    catch(err){
        res.status(400).send("Something went wrong !!");
    }
});


// Connecting to the DB
connectDB().then(() => {
    console.log("Connected successfully with the MongoDB cluster database");
    app.listen(7777, () => {
        console.log("Server started listening at 7777");
    });
}).catch(() => {
    console.log("Error connecting to the DB cluster ");
});
