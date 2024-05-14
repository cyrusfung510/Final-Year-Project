
const mongoose = require('mongoose');
const { chatRoomMembersSchema } = require('@models/chatRoomMembers.js');
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: false,
  },
  lastname:{
    type: String,
    required: false,
  },
  nickname:{
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  date_of_birth: {
    type: Date,
    required: false,
  },
  firstMajor: {
    type: String,
    required: false,
  },
  secondMajor:{
    type: String,
    required: false,
  },
  minor:{
    type: String,
    required: false,
  },
  profile_image: {
    type: String,
    required: false,
  },
  year_of_study:{
    type: String,
    required: false,
  },
  chatRoomMembers: [chatRoomMembersSchema],
  registrationToken : {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
