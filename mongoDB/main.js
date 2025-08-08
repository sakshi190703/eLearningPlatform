// the models of mongoose are collections for database
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));//for linking css file which is present in public folder
app.use(express.urlencoded({extended:true})); //to parse the data for create route
app.use(methodOverride("_method"));

main()  
    .then(()=>{
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// Index Route
app.get("/chats",async(req, res)=>{
    let chats = await Chat.find();
    console.log(chats);
    res.render("main.ejs", {chats});
});

//new Route
app.get("/chats/new", (req, res)=>{
    res.render("new.ejs");
})

//create Route
app.post("/chats", async (req, res)=>{
    let {from, to, msg}= req.body;//parsing of data needed
    let newChat = new Chat({
        from : from,
        to : to,
        msg : msg,
        created_at : new Date(),
    });
    await newChat.save()
    res.redirect("/chats");
});

//Edit Route
app.get("/chats/:id/edit", async (req, res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
});

//update route
app.put("/chats/:id", async(req, res)=>{
    let {id} = req.params;
    let {msg : newMsg} = req.body;
    let updatechat = await Chat.findByIdAndUpdate(
        id,
        {msg: newMsg},
        {runValidators: true, new:true}
    );
    console.log(updateChat);
    res.redirect("/chats");
});

//destroy route
app.delete("/chats/:id", async(req, res)=>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
});

app.get("/", (req, res)=>{ 
    res.send("root is working"); 
});

app.listen(8080, ()=>{
    console.log(`app is llistening on port 8080`);
});