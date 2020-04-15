const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//
//creating user schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if(value.search(" ") != -1){
                throw new Error("username cant contain space!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if(value.toLowerCase().includes("password")){
                throw new Error("password must not inlude password")
            }
        }
    },
    nickName: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowerCase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email!")
            }
        }
    },
    phoneNumber: {},
    chats: {},
    contacts: {},
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
});

//
//hashing plain password
userSchema.pre("save", async function (next) {
    const user = this

    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})
//hiding password and tokens
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}
//token generator
userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, "user", {expiresIn: "2 days"});
    user.tokens = user.tokens.concat({token});

    await user.save();

    return token;
}
//finding account by email and password
userSchema.statics.findByCredentials = async (email, password) => {
    if(!validator.isEmail(email)) {
        throw ({error: "Email is not valid!"});
    }

    const user = await User.findOne({email});
    if(!user) {
        throw ({error:'Unable to find the user'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw ({error:'Password is incorrect'});
    }

    return user;
}

//
//creating user model
const User = mongoose.model("User", userSchema);

//
module.exports = User;
