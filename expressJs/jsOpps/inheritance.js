class person{
    constructor(name, age){
        console.log("person class connstructor")
        this.name = name;
        this.age = age;
    }
    talk(){
        console.log("hi", this.name);
    }
}

class Student extends person{
    constructor(name, age, marks){
        console.log("student class connstructor")
        super(name, age);
       // this.name = name;
       // this.age = age;
        this.marks = marks;
    }
    // talk(){
    //     console.log("hi,", this.name);
    // }
}

class teacher extends person{
    constructor(name, age, sub){
        console.log("teacher class connstructor")
        super(name ,age);
        //this.name = name;
        //this.age = age;
        this.sub = sub;
    }
    // talk(){
    //     console.log("hi,", this.name);
    // }
}

