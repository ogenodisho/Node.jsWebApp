var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    email: String,
    mobileNumber: Number,
    favouriteWebsite: String,
    favouriteColour: String
});

User.methods.getFullName = function() {
    return this.firstName + " " + this.lastName;
}
User.methods.getAge = function() {
    return ~~((Date.now() - new Date(this.dateOfBirth)) / (31557600000));
}

User.plugin(passportLocalMongoose, {
    usernameQueryFields: ["username", "email"], // TODO not working
    errorMessages: {
        IncorrectPasswordError: "Incorrect password!",
        IncorrectUsernameError: "Username does not exist!"
    }
});

module.exports = mongoose.model("User", User);
