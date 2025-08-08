const express = require("express");
const app = express();

//console.dir(app);
// listen request
let port = 3000;
app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`);
});

// routing
app.get("/", (req, res)=>{
    res.send("you connected root path");
});

app.get("/:username", (req, res)=>{
    res.send("hello");
    console.log(req.params);
    
});

//path parameters



app.get("/search", (req, res)=>{
    console.log(req.query);
    res.send("you connected to search path");
});
/*

app.get("*", (req, res)=>{
    res.send("this path does not exist");
});

*/

//app.post


/* 

// send, receive request
app.use((req, res)=>{
    //console.log(req)
    console.log("request received");
    //sending  a response 
    res.send("this is a basic response");
});

*/