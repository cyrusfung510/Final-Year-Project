const mongoose = require("mongoose");

const chatRoomMembersSchema = new mongoose.Schema({
  joined_date: {
    type: Date,
    required: true,
  },
  left_date: {
    type: Date,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
});

module.exports = {
  chatRoomMembersSchema,
};
