const mongoose = require("mongoose");

main()
    .then(()=>{
        console.log("successfull connection");
    })
    .catch((err)=> console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
}

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    age : Number,
});

const User = mongoose.model("User", userSchema);

// use User.findById for by id 
User.find({age : {$gt : 50}})
    .then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    });
/*
User.insertMany([
    {name:"tony", email:"1@gmail.com", age : 30},
    {name:"mony", email:"2@gmail.com", age : 65},
    {name:"tom", email:"3@gmail.com", age : 32},
    {name:"jerry", email:"4@gmail.com", age : 90},
]).then((res)=>{
    console.log(res);
});
*/
/*
const user2 = new User({
    name : "pavan",
    email : "abcd@gmail.com",
    age:20,
});


user2
    .save()
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    });

    */