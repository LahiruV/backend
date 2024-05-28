const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    companyName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Apply = mongoose.model("Apply", applySchema);
module.exports = Apply;
