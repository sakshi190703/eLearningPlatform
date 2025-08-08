// conditional statement 
const express = require("express");
const app = express();
const path = require("path");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/rolldice", (req, res)=>{
    let diceVal = Math.floor(Math.random()*6+1);
    res.render("rollDice.ejs", {diceVal});
});

app.listen(port, ()=>{
    console.log(`app is listening on the port ${port}`);
});
