const mongoose = require("mongoose");
const validator = require("validator");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [30, "First name cannot exceed 30 characters"]
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: [30, "Last name cannot exceed 30 characters"]
    },

    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email address"
      }
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"]
    },

    age: {
      type: Number,
      min: [13, "Minimum age is 13"],
      max: [120, "Invalid age value"]
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender not valid"
      }
    },

    photoUrl: {
      type: String,
      default:
        "https://www.un.org/pga/73/wp-content/uploads/sites/53/2018/09/Dummy-image-1.jpg",
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid photo URL"
      }
    },

    about: {
      type: String,
      default: "Description not mentioned",
      maxlength: [200, "About section cannot exceed 200 characters"]
    },

    skills: [
      {
        type: String,
        minlength: [3, "Skill must be at least 3 characters"],
        maxlength: [20, "Skill cannot exceed 20 characters"],
        match: [/^[a-zA-Z0-9]+$/, "Skill must be alphanumeric only"]
      }
    ]
  },
  { timestamps: true }
);
userSchema.methods.getJWT = async  function(){
  const user = this;


  const token = await jwt.sign({_id:user._id}, "DEVTINDRER@47687",{
    expiresIn:"7d"
  } )
  return token;
}

userSchema.methods.validatePassword= async function(passwordInputByUser) {
  const user = this;
const passwordHash= user.password;
  const isPasswordValid= await  bcrypt.compare(passwordInputByUser, passwordHash);
return isPasswordValid;
};


const User = mongoose.model("User", userSchema);

module.exports = User;
