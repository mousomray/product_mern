const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: "Name is Required",
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: "Email is Required",
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email address should follow the format: abc@gmail.com']
    },
    password: {
        type: String,
        required: "Password is Required",
        minlength: [8, 'Password must be at least 8 characters long']
    },
    mobile: {
        type: Number,
        required: "Mobile number is Required",
        min: [1000000000, 'Mobile number must be exactly 10 digits'],
        max: [9999999999, 'Mobile number must be exactly 10 digits']
    },
    image: {
        type: String,
        required: "Image is required"
    },
    is_verified: { type: Boolean, default: false }
})

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;