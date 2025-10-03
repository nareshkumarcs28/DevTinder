const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true

    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("gender not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.un.org/pga/73/wp-content/uploads/sites/53/2018/09/Dummy-image-1.jpg"
    },
    about: {
        type: String,
        default: "description not mentioned"
    },
     skills: [{
    type: String,
    minlength: [3, "Skill must be at least 3 characters"],
    maxlength: [10, "Skill cannot exceed 20 characters"]
  }]
},
    { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User; 