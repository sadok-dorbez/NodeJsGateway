const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel'
  },
  reciver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['user', 'company']
  }
});

module.exports = mongoose.model("message", messageSchema);
