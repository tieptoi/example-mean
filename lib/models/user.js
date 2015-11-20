var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    displayName: String,
    picture: String,
    facebook: String,
    foursquare: String,
    google: String,
    github: String,
    instagram: String,
    linkedin: String,
    live: String,
    yahoo: String,
    twitter: String,
    twitch: String
});

userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }
    next();
    // bcrypt.genSalt(10, function (err, salt) {
    //     bcrypt.hash(user.password, salt, function (err, hash) {
    //         user.password = hash;
    //         next();
    //     });
    // });
});

//Method

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.isValidPassword = function (password) {
    //console.log(password + '  ' + this.password);
    return bcrypt.compareSync(password, this.password);
};
mongoose.model('User', userSchema);
