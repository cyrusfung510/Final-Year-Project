const mongoose = require('mongoose');
const {messageStatusSchema} = require('./messageStatus.js');

const messageSchema = new mongoose.Schema({
    messageFrom : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sentDate:{
        type: Date,
        required: true,
        default: Date.now,
    },
    messageType:{
        type: String,
        required: true,
    },
    messageData:{
        type: String,
        required: true,
    },
    messageStatus:[messageStatusSchema],
});


module.exports = {
    messageSchema,
}