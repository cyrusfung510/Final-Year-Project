
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Otp = require("@models/otp.js");
const User = require("@models/user.js");
require("dotenv").config();
const sendEmail = require("@services/mailServices");
const {emailSchema, studentProfileSchema, studentProfileSchema2 } = require("@schemas/user.js");


exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const newOtp = _.sampleSize(characters, 8).join("");
    const otpRecord = await Otp.findOneAndUpdate({ email }, { otp: newOtp });
    if (!otpRecord) {
      const otpRecord = new Otp({ email, otp: newOtp });
      await otpRecord.save();
    } else {
      otpRecord.otp = newOtp;
      otpRecord.createdAt = Date.now();
      await otpRecord.save();
    }

    try {
      await sendEmail(email, newOtp);
      return res.json({ message: "OTP sent successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }
}

exports.register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User has already registered" });
    }

    const otpRecord = await Otp.findOne({ email, otp: password });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }
    res.json({ message: "success" })
    // const role = email.endsWith("@connect.hku.hk") ? "student" : "teacher";

    // try {
    //   const user = new User({ email, role });
    //   await user.save();
    //   await Otp.deleteOne({ email, otp: password });

    //   const token = jwt.sign(
    //     { id: user._id},
    //     process.env.JWT_SECRET
    //   );
    //   console.log(token);
    //   res.json({ message: "success", token });
    // } catch (err) {
    //   console.error(err);
    //   res.status(400).json({ message: "Failed to create a new user" });
    // }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const otpRecord = await Otp.findOne({ email, otp: password });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await Otp.deleteOne({ email, otp: password });
    
    const token = jwt.sign(
      {
        id: user._id,
        sub: user._id,
        aud: "application-0-eetka",
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log(token);
    res.json({ message: "success", token });
}

exports.logout = async (req, res) => {
  
}

exports.profile = async (req, res) => {
    const decoded = req.user;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: "success", user });
}

exports.firstTimeSetup = async (req, res) => {
    // const decoded = req.user;
    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   return res.status(401).json({ message: "Cannot found user" });
    // }
    const {
      email,
      password,
      firstname,
      lastname,
      nickname,
      date_of_birth,
      firstMajor,
      secondMajor,
      minor,
      profile_image,
      year_of_study,
    } = req.body;
    console.log(req.body)
    const role = email.endsWith("@connect.hku.hk") ? "student" : "teacher";
    const otpRecord = await Otp.findOne({ email, otp: password });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    let user;

    if (role == "student") {
      const result = studentProfileSchema.safeParse({
        email,
        password,
        date_of_birth,
        firstMajor,
        secondMajor,
        minor,
        profile_image,
        year_of_study,
        nickname,
        firstname,
        lastname,
      });
      if (!result.success) {
        return res.status(400).json({ message: result.error.message });
      }
      

      user = new User({
        email,
        role,
        date_of_birth,
        firstMajor,
        secondMajor,
        minor,
        profile_image,
        year_of_study,
        nickname,
        firstname,
        lastname,
      });
      await user.save();
    } else {
      user = new User({ email, role, profile_image });
      await user.save();
    }
   
    const token = jwt.sign(
      { id: user._id,
        sub: user._id,
        aud: "application-0-eetka",
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // console.log(token);
    res.json({ message: "success", token });
  
}

exports.updateProfile = async (req, res) => {
    const decoded = req.user;
    const user = await User.findOne({ _id: decoded.id }, 'role');
    
    const { nickname,secondMajor,minor, profile_image } = req.body;
    if (user.role == "student") {
      const result = studentProfileSchema2.safeParse({
        secondMajor,
        minor,
        profile_image,
        nickname,
      });

      if (!result.success) {
        return res.status(400).json({ message: result.error.message });
      }
      await User.findByIdAndUpdate(decoded.id, {
        $set: { secondMajor, minor, profile_image, nickname },
      });
    } else {
      await User.findByIdAndUpdate(decoded.id, { $set: { profile_image } });
    }

    // await user.save();
    res.json({ message: "success", user });
}

exports.updateRegistrationToken = async (req, res) => {
    try{
        const decoded = req.user;
        const { token } = req.body;
        // console.log(token)
        await User.findByIdAndUpdate(decoded.id, { $set: { registrationToken: token } });
        res.json({ message: "Token updated successfully" });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Failed to update token" });
    }
}

exports.getRegistrationToken = async (req, res) => {
  try{
      const decoded = req.user; 
      const token = await User.findById(decoded.id, { registrationToken: 1 });
      res.json(token?.registrationToken || "");

  }catch(err){
      console.error(err);
      res.status(500).json({ message: "Failed to get token" });
  }

}