const express = require('express');

const app = express();

// Request Handlers
app.use('/test',(req,res) => {
    res.send("Hello, responding to the test url request");
});


app.use("/hello", (req,res) => {
    res.send("Hello, Hello, Hello !!");
});

app.use("/",(req, res) => {
    res.send("Hello, This is express server's response");
});


app.listen(7777, () => {
    console.log("Server started listening at 7777");
});