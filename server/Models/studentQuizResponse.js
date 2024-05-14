const mongoose = require('mongoose');

const studentQuizResponseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    quizAnswer:{
        type: String,
        required: true,
    },
    quizResponse_date: {
        type: Date,
        required: true,
    },
});


module.exports = {
    studentQuizResponseSchema,
}