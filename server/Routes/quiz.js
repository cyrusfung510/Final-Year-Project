const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/auth.js");
const chatRoomController = require("@controllers/chatroom.controllers.js");
const quizController = require("@controllers/quiz.controllers.js");

router.post("/createQuiz", authMiddleware, quizController.createQuiz);

router.post('/updateQuiz', authMiddleware, quizController.updateQuiz);

router.post('/submitQuizAnswer', authMiddleware, quizController.submitQuizAnswer)

router.get("/getQuizRoom", authMiddleware, quizController.getQuizRoom);

router.post('/getQuiz', authMiddleware, quizController.getQuiz);

router.get('/getQuizQuestion', authMiddleware, quizController.getQuizQuestion)

router.get('/getQuizInformation', authMiddleware, quizController.getQuizInformation)

module.exports = router;