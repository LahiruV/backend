const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enrollSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    courseID: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },

    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Enroll = mongoose.model("Enroll", enrollSchema);
module.exports = Enroll;
