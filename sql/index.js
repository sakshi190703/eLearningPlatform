const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  database:'delta_app',
  password:'Sakshi@123'
});
//inserting new data
//let q = "insert into user (id, username, email, password) values ?";

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
}
// let data = [];
// for(let i = 1; i<= 100; i++){
//   data.push(getRandomUser());
// }
/*let user = [["123b", "123_newuserb", "abc@gmail.comb", "abcb"],
           ["123c", "123_newuserc", "abc@gmail.comc", "abcc"]];
           */

// let q = "show tables";  // create table

/*try{
  connection.query(q, [data], (err, result)=>{
    if(err)throw err;
    console.log(result);
  });
}catch(err){
  console.log(err);
}

connection.end(); //to close the connection;
*/

//Home route
app.get("/", (req, res)=>{
  let q = `select count(*) from user`;
  try{
    connection.query(q, (err, result)=>{
      if(err)throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", {count});
    });
  }catch(err){
    console.log(err);
    res.send("some error in db");
  }
});

// show route
app.get("/user", (req, res)=>{
  let q = `select * from user`;
  try{
    connection.query(q, (err, users)=>{
      if(err)throw err;
      res.render("showUsers.ejs", { users});
    });
  }catch(err){
    console.log(err);
    res.send("some error in db");
  }
});

//edit route
app.get("/user/:id/edit", (req, res)=>{
  let {id} = req.params;
  let q = `select * from user where id='${id}'`;
  try{
    connection.query(q, (err, result)=>{
      if(err)throw err;
      let user = result[0];
      res.render("edit.ejs", {user});
    });
  }catch(err){
    console.log(err);
    res.send("some error in db");
  }
});

//update route
app.patch("/user/:id", (req, res)=>{
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `select * from user where id = '${id}'`;

  try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0];
      if (formPass != user.password){
        res.send("Wrong Password");
      }else{
        let q2 = `update user set username='${newUsername}'where id = '${id}'`;
        connection.query(q2, (err, result)=>{
          if(err) throw err;
          res.redirect("/user");
        });
      }
    });
  }catch(err){
    console.log(err);
    res.send("some error in db");
  }
})


app.listen("8080", ()=>{ 
  console.log("server is listening on port 8080");
});



/*let getRandomUser = () => {
    return {
      id: faker.string.uuid(),
      username: faker.internet.username(), // before version 9.1.0, use userName()
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }
    */
//insert in bulk
  

  //  console.log(getRandomUser());