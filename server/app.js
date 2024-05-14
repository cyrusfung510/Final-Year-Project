require("module-alias/register");
const express = require("express");
const app = express();
const cors = require("cors");
const connectDb = require("@root/db.js");
require("dotenv").config();

const port = process.env.PORT || 3000;
const swaggerRoute = require("@routes/swagger.js");
const usersRoute = require("@routes/users.js");
const chatRoomRoute = require("@routes/chatRoom.js");
const quizRoute = require("@routes/quiz.js");

connectDb()
app.use(cors())
app.use(express.json({limit: '50mb'}));

app.use("/api-docs", swaggerRoute);
app.use("/users", usersRoute);
app.use("/chatRoom", chatRoomRoute);
app.use('/quiz', quizRoute);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
