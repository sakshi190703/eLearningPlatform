const express = require("express");
const app = express();
//const path = require("path");
const port = 8080;

//req.body or data does not understand by express so 
// below line is used to convert the data into readable format for express
app.use(express.urlencoded({extended:true}));
//above line only understand url encoded data 
// to understand json format includes below line
app.use(express.json());

app.get("/register",(req, res)=>{
    res.send("standard GET response");
});

app.post("/register", (req, res)=>{
    res.send("standard POST response");
    console.log(req.body);
});

app.listen(port, ()=>{
    console.log(`listening on the port ${port}`);
});

