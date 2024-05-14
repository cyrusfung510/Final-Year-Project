const mongoose = require("mongoose");
const User = mongoose.model("User");
const ChatRoom = require("@models/chatRoom.js");
const { messageSchema } = require("@models/messages.js");
const { chatRoomMembersSchema } = require("@models/chatRoomMembers.js");
const schemaValidation = require("@utils/schemaValidation.js");
const sharp = require("sharp");
const { uploadToS3, getSignedUrlForS3Object } = require("@utils/s3BucketUtils");
const { v4: uuidv4 } = require("uuid");
const { broadcastMessage } = require("@services/notification.js");

exports.createChatRoom = async (req, res) => {
  // {
  //    chatRoomName: "chat room name"
  //    chatRoomImage: "",
  //    privacy: "public" / "private",
  //    groupMembers: [],
  // }
  try {
    const decoded = req.user;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }
    const { chatRoomName, chatRoomImage, privacy, groupMembers } = req.body;
    if (!chatRoomName || chatRoomName === "") {
      return res.status(401).json({ error: "Chat room name is required" });
    }
    if (groupMembers.length < 1) {
      return res.status(401).json({ error: "At least one member is required" });
    }
    const chatroom = new ChatRoom({
      chatRoomName,
      chatRoomImage,
      privacy,
      members: [user._id, ...groupMembers.filter((_) => _ !== "")],
    });
    await chatroom.save();
    const chatRoomMember = {
      chatRoomId: chatroom._id,
      userId: user._id,
      isAdmin: true,
      joined_date: Date.now(),
    };
    const validationError = schemaValidation(
      chatRoomMember,
      chatRoomMembersSchema
    );
    if (validationError) {
      console.log(validationError);
      await ChatRoom.findByIdAndDelete(chatroom._id);
      return res.status(401).json({ error: validationError.message });
    } else {
      user.chatRoomMembers.push(chatRoomMember);
      for (let member of groupMembers) {
        if (member === "" || !mongoose.Types.ObjectId.isValid(member))
        continue;
        if (member === user._id) {
          await ChatRoom.findByIdAndDelete(chatroom._id);
          return res
            .status(401)
            .json({ error: "User cannot invite himself to a chat room" });
        }
        const newUser = await User.findOne({ _id: member }, "chatRoomMembers");
        if (!newUser) {
          await ChatRoom.findByIdAndDelete(chatroom._id);
          return res.status(401).json({ error: "Invited user does not exist" });
        }
        const newMember = {
          chatRoomId: chatroom._id,
          userId: member,
          isAdmin: false,
          joined_date: Date.now(),
        };
        const validationError = schemaValidation(
          newMember,
          chatRoomMembersSchema
        );
        if (validationError) {
          console.log(validationError);
          return res.status(401).json({ error: validationError.message });
        } else {
          newUser.chatRoomMembers.push(newMember);
          await newUser.save();
        }
      }

      await user.save();
      return res
        .status(201)
        .json({ message: "Chat room created successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getMessage = async (req, res) => {
  const decoded = req.user;
  const { chatRoomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(401).json({ error: "Chat room does not exist" });
    }
    const isMember = chatRoom.members.find(
      (_) => _.toString() === decoded.id.toString()
    );
    if (!isMember) {
      return res
        .status(401)
        .json({ error: "User is not a member of the chat room" });
    }

    const userMappingArray = await Promise.all(
      chatRoom.members.map(async (member) => {
        const user = await User.findById(member);
        let compressedImageDataURL = "";
        if (user.profile_image !== "") {
          const base64Image = user.profile_image.split(";base64,").pop();
          const profileImageBuffer = Buffer.from(base64Image, "base64");
          const compressedImageBuffer = await sharp(profileImageBuffer)
            .resize(50, 50)
            .toBuffer();
          compressedImageDataURL = `data:image/jpeg;base64,${compressedImageBuffer.toString(
            "base64"
          )}`;
        }
        // console.log(compressedImageBuffer)
        // console.log(compressedImageDataURL);
        return {
          [user._id]: {
            nickName: user.nickname,
            profile_image: compressedImageDataURL,
          },
        };
      })
    );
    const userMapping = userMappingArray.reduce((acc, cur) => {
      return { ...acc, ...cur };
    }, {});

    const msgArr = Array.from(chatRoom.messages).map((msg, index) => {
      return {
        messageId: msg._id,
        messageFrom: msg.messageFrom,
        messageData: msg.messageData,
        messageType: msg.messageType,
        sentDate: msg.sentDate,
        messageStatus: msg.messageStatus,
      };
    });
    // console.log(msgArr);
    res.json({
      messages: msgArr,
      map: userMapping,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getChatRooms = async (req, res) => {
  try {
    const decoded = req.user;
    const user = await User.findOne(
      {
        _id: decoded.id,
      },
      "chatRoomMembers"
    );
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }
    // console.log(user.chatRoomMembers.map((_) => _.chatRoomId));
    let chatRooms = await ChatRoom.aggregate([
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
      {
        $addFields: {
          unseenMessages: {
            $filter: {
              input: "$messages",
              as: "message",
              cond: {
                $and: [
                  {
                    $ne: [
                      "$$message.messageFrom",
                      new mongoose.Types.ObjectId(decoded.id),
                    ],
                  },
                  {
                    $not: {
                      $in: [
                        new mongoose.Types.ObjectId(decoded.id),
                        "$$message.messageStatus.userId",
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          lastMessage: {
            $ifNull: [{ $arrayElemAt: ["$messages.messageData", -1] }, ""],
          },
          sentDate: {
            $ifNull: [{ $arrayElemAt: ["$messages.sentDate", -1] }, ""],
          },
          unseenMessageNumber: { $size: "$unseenMessages" },
        },
      },
      {
        $project: {
          chatRoomId: "$_id",
          chatRoomName: 1,
          lastMessage: 1,
          chatRoomImage: 1,
          sentDate: 1,
          createdAt: 1,
          unseenMessageNumber: 1,
        },
      },
    ]);
    //   return {
    //     chatRoomId: chatRoom._id,
    //     chatRoomName: chatRoom.chatRoomName,
    //     lastMessage:
    //       chatRoom.messages[chatRoom.messages.length - 1]?.messageData || "",
    //     chatRoomImage: chatRoom.chatRoomImage || "",
    //     sentDate:
    //       chatRoom.messages[chatRoom.messages.length - 1]?.sentDate || "",
    //     createdAt: chatRoom.createdAt,
    //     unseenMessageNumber: unseenMessage.length,
    //   };
    // });
    return res.status(200).json(chatRooms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.handleMessage = async (req, res) => {
  try {
    const decoded = req.user;

    const { messageData, messageType, chatRoomId } = req.body;

    const message = {
      messageFrom: decoded.id,
      messageType,
      messageData,
    };
    const validationError = schemaValidation(message, messageSchema);
    if (validationError) {
      return res.status(401).json({ error: validationError.message });
    }
    const chatRoom = await ChatRoom.findOne(
      { _id: chatRoomId, members: decoded.id.toString() },
      "chatRoomName members"
    );
    if (!chatRoom) {
      return res.status(401).json({
        error:
          "Chat room does not exist or user is not a member of the chat room",
      });
    }

    await ChatRoom.updateOne(
      { _id: chatRoomId },
      { $push: { messages: message } }
    );
    const registrationTokens = await ChatRoom.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(chatRoomId) } },
      { $unwind: "$members" },
      {
        $addFields: {
          members: {
            $toObjectId: "$members",
          },
        },
      },
      // // {$match: {"members": {$ne: decoded.id.toString()}}},
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $project: { registrationToken: "$user.registrationToken" } },
    ]);
    const tokens = registrationTokens
      .map((_) => _.registrationToken)
      .filter((token) => token !== undefined);
    const user = await User.findById(decoded.id, "nickname profile_image");
    let compressedImageDataURL = "";
    if (user.profile_image !== "") {
      const base64Image = user.profile_image.split(";base64,").pop();
      const profileImageBuffer = Buffer.from(base64Image, "base64");
      const compressedImageBuffer = await sharp(profileImageBuffer)
        .resize(50, 50)
        .toBuffer();
      compressedImageDataURL = `data:image/jpeg;base64,${compressedImageBuffer.toString(
        "base64"
      )}`;
    }

    broadcastMessage(
      {
        title: `${chatRoom.chatRoomName}`,
        body: `${user.nickname}: ${messageData}`,
        icon: compressedImageDataURL,
      },
      tokens
    );
    // chatRoom.messages.push(message);
    // await chatRoom.save();
    return res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.handleFile = async (req, res) => {
  try {
    const decoded = req.user;

    const { chatRoomId, dataType, messageType } = JSON.parse(req.body.data);
    const file = req.file;

    const chatRoom = await ChatRoom.findOne(
      { _id: chatRoomId, members: decoded.id.toString() },
      "members messages"
    );
    if (!chatRoom) {
      return res.status(401).json({
        error:
          "Chat room does not exist or user is not a member of the chat room",
      });
    }
    console.log(file);
    const uuid = uuidv4();
    await uploadToS3(
      file.buffer,
      chatRoomId + "/" + uuid + "_" + file.originalname,
      file.mimetype
    );
    const message = {
      messageFrom: decoded.id,
      messageType: file.mimetype,
      messageData: uuid + "_" + file.originalname,
    };
    const validationError = schemaValidation(message, messageSchema);
    if (validationError) {
      return res.status(401).json({ error: validationError.message });
    }
    chatRoom.messages.push(message);
    await chatRoom.save();
    const registrationTokens = await ChatRoom.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(chatRoomId) } },
      { $unwind: "$members" },
      {
        $addFields: {
          members: {
            $toObjectId: "$members",
          },
        },
      },
      // // {$match: {"members": {$ne: decoded.id.toString()}}},
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $project: { registrationToken: "$user.registrationToken" } },
    ]);
    const tokens = registrationTokens
      .map((_) => _.registrationToken)
      .filter((token) => token !== undefined);
    const user = await User.findById(decoded.id, "nickname profile_image");
    let compressedImageDataURL = "";
    if (user.profile_image !== "") {
      const base64Image = user.profile_image.split(";base64,").pop();
      const profileImageBuffer = Buffer.from(base64Image, "base64");
      const compressedImageBuffer = await sharp(profileImageBuffer)
        .resize(50, 50)
        .toBuffer();
      compressedImageDataURL = `data:image/jpeg;base64,${compressedImageBuffer.toString(
        "base64"
      )}`;
    }
    broadcastMessage(
      {
        title: `${chatRoom.chatRoomName}`,
        body: `${user.nickname}: Image🖼`,
        icon: compressedImageDataURL,
        image: await getSignedUrlForS3Object(
          chatRoomId + "/" + uuid + "_" + file.originalname
        ),
      },
      tokens
    );

    res.status(201).json({ message: "File uploaded successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getSignedUrls = async (req, res) => {
  try {
    const { urls } = req.body;
    const signedUrlsArr = await Promise.all(
      urls.map(async (url) => {
        return { [url]: await getSignedUrlForS3Object(url) };
      })
    );
    const signedUrls = signedUrlsArr.reduce((acc, cur) => {
      return { ...acc, ...cur };
    }, {});

    res.status(200).json(signedUrls);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const decoded = req.user;
    const { messageIds } = req.body;
    const objectIds = messageIds.map((_) => new mongoose.Types.ObjectId(_));
    // console.log(objectIds);
    const chatRoom = await ChatRoom.find({
      "messages._id": { $in: objectIds },
    });
    if (chatRoom.length === 0) {
      return res.status(401).json({ error: "Message does not exist" });
    }

    chatRoom[0].messages?.forEach((message) => {
      // console.log(messageIds, message._id, messageIds.includes(message._id.toString()));
      // console.log(messageIds.includes(message._id.toString()), message.messageFrom.toString() !== decoded.id.toString(), !message.messageStatus.some((_) => _.userId.toString() === decoded.id.toString()));
      if (
        messageIds.includes(message._id.toString()) &&
        message.messageFrom.toString() !== decoded.id.toString() &&
        !message.messageStatus.some(
          (_) => _.userId.toString() === decoded.id.toString()
        )
      ) {
        message.messageStatus.push({
          userId: decoded.id,
          read_date: Date.now(),
        });
      }
    });
    await chatRoom[0].save();
    res.status(200).json({ message: "Message status updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getChatRoomInformation = async (req, res) => {
  try {
    const decoded = req.user;
    const { chatRoomId } = req.query;
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(401).json({ error: "Chat room does not exist" });
    }
    const isMember = chatRoom.members.find(
      (_) => _.toString() === decoded.id.toString()
    );
    if (!isMember) {
      return res
        .status(401)
        .json({ error: "User is not a member of the chat room" });
    }
    const privacy = chatRoom.privacy;
    const members = chatRoom.members;

    const memberDetails = await Promise.all(
      members.map(async (member) => {
        const user = await User.findById(member);
        const chatRoomMember = user.chatRoomMembers.find(
          (m) => m.chatRoomId.toString() === chatRoomId
        );
        return {
          userId: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          nickname: user.nickname,
          email: user.email,
          role: user.role,
          profile_image: user.profile_image,
          isAdmin: chatRoomMember ? chatRoomMember.isAdmin : null,
          joinedDate: chatRoomMember ? chatRoomMember.joined_date : null,
        };
      })
    );
    // console.log(memberDetails);

    res.status(200).json({ privacy, members: memberDetails });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateChatRoomInformation = async (req, res) => {
  try {
    const decoded = req.user;
    const {
      chatRoomId,
      chatRoomProfileImage,
      invitationList,
      memberList,
      newGroupName,
      privacy,
    } = req.body;
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(401).json({ error: "Chat room does not exist" });
    }
    const isMember = chatRoom.members.find(
      (_) => _.toString() === decoded.id.toString()
    );
    const user = await User.findById(decoded.id);
    const isAdmin = user.chatRoomMembers.find(
      (_) => _.chatRoomId.toString() === chatRoomId
    ).isAdmin;

    if (!isMember) {
      return res
        .status(401)
        .json({ error: "User is not a member of the chat room" });
    }
    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: "User is not an admin of the chat room" });
    }
    if (chatRoomProfileImage) {
      chatRoom.chatRoomImage = chatRoomProfileImage;
    }
    chatRoom.chatRoomName = newGroupName;
    chatRoom.privacy = privacy;

    const intersectedMembers = memberList.filter((member) =>
      chatRoom.members.some(
        (id) => id !== decoded.id && id === member.memberUserID
      )
    );
    const deletedMembers = chatRoom.members.filter(
      (id) =>
        id !== decoded.id &&
        memberList.every((member) => member.memberUserID !== id)
    );
    // console.log(chatRoom)
    for (let member of intersectedMembers) {
      await User.updateOne(
        { _id: member.memberUserID, "chatRoomMembers.chatRoomId": chatRoomId },
        { $set: { "chatRoomMembers.$.isAdmin": member.memberIsChatRoomAdmin } }
      );
    }
    await ChatRoom.updateOne(
      { _id: chatRoomId },
      { $pull: { members: { $in: deletedMembers } } }
    );
    for (let id of deletedMembers) {
      const objectId = new mongoose.Types.ObjectId(id);
      await User.updateOne(
        { _id: objectId, "chatRoomMembers.chatRoomId": chatRoomId },
        { $set: { "chatRoomMembers.$.left_date": new Date() } }
      );
    }
    for (let memberId of invitationList) {
      if (memberId === "" || !mongoose.Types.ObjectId.isValid(memberId))
        continue;
      if (memberId === decoded.id) {
        await chatRoom.save();
        return res
          .status(401)
          .json({ error: "User cannot invite himself to a chat room" });
      }
      console.log(memberId === decoded.id, memberId);
      const newUser = await User.findById(memberId);
      if (!newUser) {
        await chatRoom.save();
        return res.status(401).json({ error: "Invited user does not exist" });
      }
      let member = newUser.chatRoomMembers.find(
        (m) => m.chatRoomId == chatRoomId
      );

      if (!member) {
        {
          const newMember = {
            chatRoomId: chatRoomId,
            userId: memberId,
            isAdmin: false,
            joined_date: Date.now(),
          };
          const validationError = schemaValidation(
            newMember,
            chatRoomMembersSchema
          );
          if (validationError) {
            console.log(validationError);
            return res.status(401).json({ error: validationError.message });
          }
          newUser.chatRoomMembers.push(newMember);
          // chatRoom.members.push(memberId);
        }
      } else if (member.left_date == null) {
        await chatRoom.save();
        return res
          .status(401)
          .json({ error: "User is already a member of the chat room" });
      } else if (member) {
        member.isAdmin = false;
        member.left_date = null;
        member.joined_date = Date.now();
      } else {
        console.log("error");
      }
      await newUser.save();
      chatRoom.members.push(memberId);
    }
    await chatRoom.save();

    res
      .status(200)
      .json({ message: "Chat room information updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupMemberProfile = async (req, res) => {
  try {
    const decoded = req.user;
    const { userId } = req.body;
    const result = await User.aggregate([
      {
        $match: {
          _id: { $in: [decoded.id, new mongoose.Types.ObjectId(userId)] },
        },
      },
      { $unwind: "$chatRoomMembers" },
      {
        $match: {
          $or: [
            { "chatRoomMembers.left_date": { $exists: false } },
            { "chatRoomMembers.left_date": null },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          chatRoomMembers: { $push: "$chatRoomMembers.chatRoomId" },
        },
      },
      {
        $group: {
          _id: null,
          commonChatRoomMembers: {
            $first: { $setIntersection: ["$chatRoomMembers"] },
          },
        },
      },
    ]);

    // console.log(result);
    const isAccessible = result[0]?.commonChatRoomMembers?.length > 0;
    if (!isAccessible) {
      return res
        .status(401)
        .jsin({ error: "Cannot access the profile of the user" });
    }
    const userProfile = await User.findOne(
      { _id: userId },
      "year_of_study firstMajor secondMajor minor"
    );

    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublicChatRooms = async (req, res) => {
  try {
    const decoded = req.user;
    const userId = decoded.id.toString();
    const chatRooms = await ChatRoom.find({
      privacy: "Public",
      members: { $nin: [userId] },
    }).select("_id chatRoomName chatRoomImage");
    // console.log(userId);
    res.status(200).json(chatRooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinPublicChatRoom = async (req, res) => {
  try {
    const decoded = req.user;
    const { chatRoomId } = req.body;
    const userId = decoded.id.toString()
    
    const chatRoom = await ChatRoom.findById(chatRoomId).select(
      "privacy members"
    );
    if (!chatRoom) {
      return res.status(401).json({ error: "Chat room does not exist" });
    }
    if (chatRoom.privacy !== "Public") {
      return res.status(401).json({ error: "Chat room is not public" });
    }
    if (chatRoom.members.includes(userId)) {
      return res
      .status(401)
      .json({ error: "User is already a member of the chat room" });
    }
    await ChatRoom.findByIdAndUpdate(chatRoomId, {
      $addToSet: { members: userId },
    });

    let member = await User.findOne(
      {
        _id: userId,
        "chatRoomMembers.chatRoomId": chatRoomId,
      },
      "chatRoomMembers.$"
    );
    if (!member?.chatRoomMembers) {
      const newMember = {
        chatRoomId: chatRoomId,
        userId: userId,
        isAdmin: false,
        joined_date: Date.now(),
      };
      const validationError = schemaValidation(
        newMember,
        chatRoomMembersSchema
      );
      if (validationError) {
        console.log(validationError);
        return res.status(401).json({ error: validationError.message });
      }
      await User.updateOne(
        { _id: decoded.id },
        { $push: { chatRoomMembers: newMember } }
      );
    } else if (member.chatRoomMembers[0].left_date == null) {
      console.log(member)
      return res
        .status(401)
        .json({ error: "User is already a member of the chat room" });
    } else if (member.chatRoomMembers[0]) {
      await User.findOneAndUpdate(
        { _id: userId, "chatRoomMembers.chatRoomId": chatRoomId },
        {
          $set: {
            "chatRoomMembers.$.left_date": null,
            "chatRoomMembers.$.joined_date": Date.now(),
            "chatRoomMembers.$.isAdmin": false,
          },
        }
      );
    }
    res.status(200).json({ message: "User joined the chat room successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.leaveChatRoom = async (req, res) => {
  try {
    const decoded = req.user;
    const { chatRoomId } = req.body;
    const numberOfMembers = await ChatRoom.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(chatRoomId) } },
      { $unwind: "$members" },
      { $count: "members" },
    ]);
    if (numberOfMembers[0].members === 1) {
      await ChatRoom.findByIdAndDelete(chatRoomId);
    }
    const objectId = new mongoose.Types.ObjectId(decoded.id);
    await User.updateOne(
      { _id: objectId, "chatRoomMembers.chatRoomId": chatRoomId },
      { $set: { "chatRoomMembers.$.left_date": new Date() } }
    );
    await ChatRoom.updateOne(
      { _id: chatRoomId },
      { $pull: { members: decoded.id } }
    );
    
   
    res.status(200).json({ message: "You left the chat room" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
