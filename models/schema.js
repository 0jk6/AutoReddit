const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_utc:{
        type:String,
        default:Date.now()
    }
});

const planSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    plan:{
        type:String,
        required:true
    }
})

//pass the name and the schema to the model
mongoose.model("userSchema", userSchema);
mongoose.model("planSchema", planSchema);