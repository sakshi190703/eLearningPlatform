const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
main()
    .then(()=>{
        console.log("connection successful");
    })
    .catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let allChats = [
    {
        from:"sakshi",
        to: "kavita",
        msg: " send me notes",
        created_at : new Date(),
    },
    {
        from: "rohit",
        to:"mohit",
        msg:"how are you",
        created_at : new Date(),
    },
    {
        from:"amit",
        to: "summit",
        msg: " send me tiffin",
        created_at : new Date(),
    },
    {
        from:"sakshi",
        to: "kavita",
        msg: " send me notes",
        created_at : new Date(),
    },
    {
        from:"rohini",
        to:"mohini",
        msg: " send me books",
        created_at : new Date(),
    },
    {
        from:"geet",
        to: "meet",
        msg: "did you read that?",
        created_at : new Date(),
    },
]; 

Chat.insertMany(allChats);