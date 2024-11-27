const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true,"Provide Name !!!"]
    },

    email : {
        type: String,
        required: [true,"Provide Email !!!"],
        unique : true
    },

    password :{
        type: String,
        required: [true,"Provide Password !!!"],
    },

    role: {
        type: String, 
        default: ""
    },

    status: {
        type: String,
        default: null 
    },
},{
    timestamps:true,
});

const UserModel = mongoose.model('User',UserSchema);
module.exports = UserModel;