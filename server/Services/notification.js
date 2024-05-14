const admin = require("firebase-admin");

var serviceAccount = require("../config/im-pushnotification-4440b-firebase-adminsdk-sq1zr-62c9c053d0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const profile_image =
  "data:image/png;base64,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";
const broadcastMessage = async (message, registrationTokens) => {
    console.log("msg", message, "tokens", registrationTokens);
//   console.log(message.icon)
  const payload = {
    apns: {
      payload: {
        aps: {
          "mutable-content": 1,
        },
      },
      fcm_options: {
        image: message.icon,
      },
    },
    webpush: {
      notification: {
        title: message.title,
        body: message.body,
        icon: message.icon ?? profile_image,
        image: message?.image,
      },
      fcmOptions: {
        link: "./",
      },
    },
    sound: "default",
    badge: "1",
    click_action: "OPEN_ACTIVITY",
    priority: "high",
    tokens: registrationTokens,
  };
  try {
    const response = await admin.messaging().sendMulticast(payload);
    console.log(response.successCount + " messages were sent successfully");
  } catch (error) {
    console.error("Error sending message", error);
  }
};

module.exports = { broadcastMessage };
