// factory function

function PersonMaker(name, age){
    const person={
        name:name,
        age:age,
        talk(){
            console.log(`Hi, my name is ${this.name}`);
        },
    };

    return person;
}
//factry Function makes an copy of the function which is inefficient 

let p1 = PersonMaker("sakshi", 20);//copy
let p2 = PersonMaker("nikhil", 19);//copy

/*
// New Operator 
//constructors- doesn't return anything & start with capital
function Person(name, age){
    this.name = name;
    this.age = age;
}
Person.prototype.talk = function(){
    console.log("hi", this.name);
}

let p1 = new Person("sakshi", 20);
let p2 = new Person("nikhil", 19);
*/