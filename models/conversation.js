const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    member01: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    member02: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    messages: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
