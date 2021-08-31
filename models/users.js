const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({

    email:{
        type:String,
        required:true,
    },
    active: Boolean
});

UserSchema.plugin(passportLocalMongoose, {usernameUnique: false, 
    
    findByUsername: function(model, queryParameters) {
    // Add additional query parameter - AND condition - active: true
    queryParameters.active = true;
    return model.findOne(queryParameters)}
});

module.exports = mongoose.model('User', UserSchema);