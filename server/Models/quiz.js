const mongoose = require("mongoose");
const {studentQuizResponseSchema} = require("./studentQuizResponse.js");

const quizSchema = new mongoose.Schema({
  quizQuestion: {
    type: String,
    required: true,
  },
  quizTopics: {
    type: [String],
    required: true,
  },
  quizOptions:{
    type: [String],
    required: false,
  },
  quizModelAnswer: {
    type: String,
    required: true,
  },
  quizFrom: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sent_date: {
    type: Date,
    required: true,
  },
  quizImage: {
    type: String,
    required: false,
  },
  end_date:{
    type: Date,
    required: false,
  },
  studentQuizResponses: [studentQuizResponseSchema],
});

module.exports = {
  quizSchema,
}