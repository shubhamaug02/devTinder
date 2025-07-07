const express = require('express');

const app = express();

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

app.get("/user", (req, res) => {
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

app.listen(7777, () => {
    console.log("Server started listening at 7777");
});