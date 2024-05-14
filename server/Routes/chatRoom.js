const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/auth.js");
const chatRoomController = require("@controllers/chatroom.controllers.js");
const quizController = require("@controllers/quiz.controllers.js");
const multer = require("multer");
const upload = multer();

router.post('/newChatRoom', authMiddleware, chatRoomController.createChatRoom)

router.get('/message/:chatRoomId', authMiddleware, chatRoomController.getMessage)

router.get('/getChatRooms', authMiddleware, chatRoomController.getChatRooms)

router.get('/getPublicChatRooms', authMiddleware, chatRoomController.getPublicChatRooms)

router.post('/joinPublicChatRoom', authMiddleware, chatRoomController.joinPublicChatRoom)

router.post('/newMessage', authMiddleware, chatRoomController.handleMessage)

router.post('/newFile', upload.single('filepond'), authMiddleware, chatRoomController.handleFile)

router.post('/getSignedUrls', authMiddleware, chatRoomController.getSignedUrls)

router.post('/updateMessageStatus', authMiddleware, chatRoomController.updateMessageStatus)

router.get('/getChatRoomInformation', authMiddleware, chatRoomController.getChatRoomInformation)

router.post('/updateChatRoomInformation', authMiddleware, chatRoomController.updateChatRoomInformation)

router.post('/getGroupMemberProfile', authMiddleware, chatRoomController.getGroupMemberProfile)

router.post('/leaveChatRoom', authMiddleware, chatRoomController.leaveChatRoom)
module.exports = router;
