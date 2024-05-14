const mongoose = require('mongoose');
const {messageSchema} = require('./messages.js');
const {quizSchema} = require('./quiz.js');

const chatRoomSchema = new mongoose.Schema({
    chatRoomImage:{
        type: String,
        required: false,
    },
    chatRoomName: {
        type:String,
        required: true,
    },
    privacy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    messages: [messageSchema],
    quiz: [quizSchema],
    members:[String],
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);