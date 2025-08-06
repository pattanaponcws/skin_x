const express = require("express");
const postController = require("../controllers/post.controller");
const { protect } = require("../middlewares/auth.middleware");

const postRouter = express.Router();

//Get all post pagination
postRouter.get("/", postController.getPost);

//Get all post by author
postRouter.get("/tags", protect, postController.getPostAuthor);

//get information post
postRouter.get("/:id", protect, postController.getPostById);

module.exports = postRouter;
