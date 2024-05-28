const e = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    age: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    exam: {
      type: Array,
      default: [],
    },    
  },
  {
    timestamps: true,
  }
);
const userSchema = mongoose.model("user", user);
module.exports = userSchema; 
