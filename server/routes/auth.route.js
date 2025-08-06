const express = require("express");
const AuthController = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/signin", AuthController.signin);

authRouter.post("/signup", AuthController.signup);

authRouter.post("/signout", AuthController.signout);

module.exports = authRouter;
