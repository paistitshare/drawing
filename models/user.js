var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    password: String,
    images : { type : Array , "default" : [] },
    workflow: { type : String , "default" : "unset" },
    email: String,
    gender: String,
    address: String
});