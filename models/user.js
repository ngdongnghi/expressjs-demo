var moongose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = moongose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    }
}, { timestamp: true });

userSchema.plugin(passportLocalMongoose);

var Users = moongose.model('User', userSchema);

module.exports = Users;