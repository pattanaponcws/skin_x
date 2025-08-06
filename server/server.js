const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler");
const postRouter = require("./routes/post.route");
const authRouter = require("./routes/auth.route");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
dotenv.config();

app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen("8089", () => {
  console.log(`run on port : 8089`);
});
