const mongoose = require("mongoose");
const User = mongoose.model("User");
const { quizSchema } = require("@models/quiz.js");
const ChatRoom = require("@models/chatRoom.js");
const schemaValidation = require("@utils/schemaValidation.js");
const { quizValidation, quizValidation2 } = require("@schemas/quiz.js");

exports.createQuiz = async (req, res) => {
  try {
    const {
      chatRoomId,
      quizQuestion,
      quizOptions,
      quizTopics,
      quizModelAnswer,
      quizImage,
      quizEndDate,
    } = req.body;
    const decoded = req.user;
    const userId = decoded.id;

    // Check if the user has the role of a teacher
    const user = await User.findOne({ _id: userId }, "role");
    const isMemeber = await ChatRoom.exists({
      _id: chatRoomId,
      members: userId.toString(),
    });
    if (!isMemeber) {
      return res
        .status(403)
        .json({ message: "You are not a member of this chatroom" });
    }
    if (user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can create quizzes" });
    }
    const result = quizValidation.safeParse({
      chatRoomId,
      quizImage,
      quizQuestion,
      quizOptions,
      quizModelAnswer,
      quizTopics,
      end_date: quizEndDate,
    });
    if (!result.success) {
      console.log(result.error);
      return res.status(400).json(result.error.errors);
    }

    const quiz = {
      quizId: new mongoose.Types.ObjectId(),
      quizOptions,
      quizQuestion,
      quizFrom: userId,
      quizTopics,
      quizModelAnswer,
      sent_date: Date.now(),
      end_date: quizEndDate ?? Date.now() + 1000 * 60 * 10,
      quizImage,
    };

    // Validate the quiz
    const validationError = schemaValidation(quiz, quizSchema);
    if (validationError) {
      console.log(validationError);
      return res.status(401).json({ error: validationError.message });
    }
    // Append the quiz to the chatroom
    await ChatRoom.findByIdAndUpdate(chatRoomId, {
      $push: { quiz: quiz },
    });

    res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const decoded = req.user;
    const {
      quizId,
      quizQuestion,
      quizOptions,
      quizModelAnswer,
      quizTopics,
      quizImage,
      quizEndDate,
    } = req.body;
    const userId = decoded.id.toString();
    const user = await User.findById(userId).select("role -_id");
    if (user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this quiz" });
    }
    const isMember = await ChatRoom.exists({
      "quiz._id": quizId,
      members: userId,
    });
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this quiz" });
    }
    const quiz = {
      quizId,
      quizQuestion,
      quizOptions,
      quizModelAnswer,
      quizTopics,
      quizImage,
      end_date: quizEndDate,
    };
    const result = quizValidation2.safeParse(quiz);
    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }
    const updatedQuiz = await ChatRoom.findOneAndUpdate(
      {
        "quiz._id": quizId,
      },
      {
        $set: {
          "quiz.$.quizQuestion": quizQuestion,
          "quiz.$.quizOptions": quizOptions,
          "quiz.$.quizModelAnswer": quizModelAnswer,
          "quiz.$.quizTopics": quizTopics,
          "quiz.$.quizImage": quizImage,
          "quiz.$.end_date": quizEndDate,
          "quiz.$.studentQuizResponses": [],
        },
      }
    );

    res.status(200).json({ message: "Quiz updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuizAnswer = async (req, res) => {
  try {
    const decoded = req.user;
    const { quizId, quizAnswer } = req.body;
    const userId = decoded.id.toString();

    const user = await User.findById(userId).select("role -_id");
    if (user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can submit quiz answers" });
    }
    const isMember = await ChatRoom.exists({
      "quiz._id": quizId,
      members: userId,
    });
    if (!isMember) {
      return res.status(403).json({
        message: "You are not authorized to submit answers for this quiz",
      });
    }
    const quizOpt = await ChatRoom.aggregate([
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $unwind: "$quiz" },
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $project: { quizOptions: "$quiz.quizOptions", _id: 0 } },
    ]);
    if (!quizOpt[0].quizOptions.includes(quizAnswer)) {
      return res.status(400).json({ message: "Invalid quiz answer" });
    }
    const hasSubmitted = await ChatRoom.findOne({
      "quiz._id": new mongoose.Types.ObjectId(quizId),
      "quiz.studentsResponses.userId": decoded.id,
    });

    if (hasSubmitted) {
      return res.status(400).json({
        message: "You have already submitted an answer for this quiz",
      });
    }

    const studentQuizResponse = {
      userId: decoded.id,
      quizAnswer,
      quizResponse_date: Date.now(),
    };
    const quizEndDate = await ChatRoom.aggregate([
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $unwind: "$quiz" },
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $project: { end_date: "$quiz.end_date", _id: 0 } },
    ]);
    if (quizEndDate.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    if (Date.now() > quizEndDate[0].end_date) {
      return res.status(403).json({ message: "Quiz has ended" });
    }
    const isAnswered = await ChatRoom.exists({
      "quiz._id": quizId,
      "quiz.studentQuizResponses.userId": decoded.id,
    });
    if (isAnswered) {
      return res.status(403).json({
        message: "You have already submitted an answer for this quiz",
      });
    }
    await ChatRoom.findOneAndUpdate(
      {
        "quiz._id": quizId,
      },
      {
        $push: {
          "quiz.$.studentQuizResponses": studentQuizResponse,
        },
      }
    );
    res.status(201).json({ message: "Quiz answer submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuizRoom = async (req, res) => {
  try {
    const decoded = req.user;
    const user = await User.findById(decoded.id, "role chatRoomMembers");
    const quizRooms = await ChatRoom.aggregate([
      {
        $match: {
          _id: {
            $in: user.chatRoomMembers.map((_) => {
              if (_?.left_date) return null;
              return _.chatRoomId;
            }),
          },
        },
      },
      { $unwind: "$members" },
      {
        $addFields: {
          members: {
            $toObjectId: "$members",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $match: {
          "members.role": "teacher",
        },
      },
      {
        $addFields: {
          lastQuizSentDate: {
            $max: "$quiz.sent_date",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          chatRoomName: { $first: "$chatRoomName" },
          chatRoomImage: { $first: "$chatRoomImage" },
          lastQuizSentDate: { $first: "$lastQuizSentDate" },
        },
      },
    ]);
    
    res.status(200).json(quizRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const decoded = req.user;
    const { chatRoomId } = req.body;
    const quiz = await ChatRoom.findOne({ _id: chatRoomId }).select(
      "quiz.quizTopics quiz.sent_date quiz.end_date quiz._id"
    );
    // console.log(quiz)
    res.status(200).json(quiz.quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizQuestion = async (req, res) => {
  try {
    const decoded = req.user;
    const { quizId } = req.query;
    const { role } = await User.findById(decoded.id).select("role -_id");
    let quiz = await ChatRoom.findOne(
      { quiz: { $elemMatch: { _id: quizId } } },
      { "quiz.$": 1 }
    );
    // console.log(quiz)
    quiz = quiz.quiz || [];
    if (role === "student") {
      quiz = quiz.map((x) => {
        return {
          quizQuestion: x.quizQuestion,
          quizOptions: x.quizOptions,
          quizTopics: x.quizTopics,
          quizImage: x.quizImage,
          quizSentDate: x.sent_date,
          quizEndDate: x.end_date,
          studentQuizResponses: x.studentQuizResponses.filter(
            (y) => y.userId == decoded.id
          ),
          quizModelAnswer: x.end_date < Date.now() ? x.quizModelAnswer : null,
        };
      });
    }

    res.status(200).json({ quiz, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizInformation = async (req, res) => {
  try {
    const decoded = req.user;
    const { quizId } = req.query;
    const { role } = await User.findById(decoded.id).select("role -_id");
    if (role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teacher can get quiz information" });
    }
    const listOfSubmittedUser = await ChatRoom.aggregate([
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $unwind: "$quiz" },
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $unwind: "$quiz.studentQuizResponses" },
      {
        $lookup: {
          from: "users",
          localField: "quiz.studentQuizResponses.userId",
          foreignField: "_id",
          as: "quiz.studentQuizResponses.user",
        },
      },
      { $unwind: "$quiz.studentQuizResponses.user" },
      {
        $project: {
          studentFirstName: "$quiz.studentQuizResponses.user.firstname",
          studentLastName: "$quiz.studentQuizResponses.user.lastname",
          studentUserId: "$quiz.studentQuizResponses.user._id",
          role: "$quiz.studentQuizResponses.user.role",
          studentQuizResponseOption: {
            $indexOfArray: [
              "$quiz.quizOptions",
              "$quiz.studentQuizResponses.quizAnswer",
            ],
          },
          studentQuizResponseDate:
            "$quiz.studentQuizResponses.quizResponse_date",
          studentProfileImage: "$quiz.studentQuizResponses.user.profile_image",
        },
      },
    ]);

    const listOfUnSubmittedUser = await ChatRoom.aggregate([
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $unwind: "$quiz" },
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $unwind: "$members" },
      {
        $addFields: {
          members: {
            $toObjectId: "$members",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "memberDetail",
        },
      },
      { $unwind: "$memberDetail" },
      {
        $project: {
          studentFirstName: "$memberDetail.firstname",
          studentLastName: "$memberDetail.lastname",
          studentUserId: "$memberDetail._id",
          studentProfileImage: "$memberDetail.profile_image",
          role: "$memberDetail.role",
          submitted: {
            $cond: [
              {
                $in: ["$memberDetail._id", "$quiz.studentQuizResponses.userId"],
              },
              true,
              false,
            ],
          },
        },
      },
      {
        $match: {
          submitted: false,
        },
      },
    ]);
    const quizInfo = await ChatRoom.aggregate([
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      { $unwind: "$quiz" },
      { $match: { "quiz._id": new mongoose.Types.ObjectId(quizId) } },
      {
        $project: {
          chatRoomName: "$chatRoomName",
          quizQuestion: "$quiz.quizQuestion",
          quizOptions: "$quiz.quizOptions",
          quizModelAnswer: "$quiz.quizModelAnswer",
          quizModelAnswerIndex: {
            $indexOfArray: ["$quiz.quizOptions", "$quiz.quizModelAnswer"],
          },
          quizTopics: "$quiz.quizTopics",
          quizSentDate: "$quiz.sent_date",
          quizEndDate: "$quiz.end_date",
        },
      },
    ]);

    res.status(200).json({
      submittedUsers: listOfSubmittedUser,
      unSubmittedUsers: listOfUnSubmittedUser,
      quizInfo: quizInfo[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
