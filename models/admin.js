const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const admin = new Schema(
  {
    name: {
      type: String,
      default: "",
    },  
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },    
    password: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const adminSchema = mongoose.model("admin", admin);
module.exports = adminSchema;
