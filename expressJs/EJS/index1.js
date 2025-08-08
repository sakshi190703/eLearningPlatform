//embedded javaScript templates(EJS)
const express = require("express");
const app = express();
// to require path package
const path = require("path");

const port = 8080;

app.set("view engine", "ejs");
//to execute this folder without an error of views folder from outside of EJS folder too
app.set("views", path.join(__dirname, "/views"));

/*app.get("/", (req , res)=>{
    res.render("home.ejs");
}); 

*/

app.get("/ig/:username",(req, res)=>{
    //loop
    const followers = ["adam", "bob", "steve", "abc"];
    let {username} = req.params;
    res.render("instagram.ejs", {username, followers});
})

app.get("/hello", (req, res)=>{
    res.send("hello");
});

// this output is displayed on the terminal
app.listen(port, ()=>{
    console.log(`app is listening on the port ${port}`);
});

