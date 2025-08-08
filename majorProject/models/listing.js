const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    image : {
        type : String,
        default : "/home/sakshi/vsCode/majorProject/defaultbg.jpg" ,
        set: (v) => v === "" ? "/home/sakshi/vsCode/majorProject/defaultbg.jpg" : v,
    },
    price : {
        type : Number,
    },
    location : {
        type : String,
    },
    Country : {
        type : String,
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;