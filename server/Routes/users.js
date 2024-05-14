const express = require("express");
const router = express.Router();
require("dotenv").config();
const authMiddleware = require("@middlewares/auth.js");
const userController = require("@controllers/user.controllers.js");


router.post("/send-otp", userController.sendOtp);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/profile", authMiddleware, userController.profile);

router.post("/first-time-setup", userController.firstTimeSetup);

router.post("/update-profile", authMiddleware, userController.updateProfile);

router.post('/updateRegistrationToken', authMiddleware, userController.updateRegistrationToken);

router.get(
  "/getRegistrationToken",
  authMiddleware,
  userController.getRegistrationToken
);

module.exports = router;
