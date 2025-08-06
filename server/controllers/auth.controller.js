const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthService = require("../services/auth.service");

const prisma = new PrismaClient();

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) return res.status(403).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await AuthService.createUser({ username, email, hash });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ userId: newUser.id, email: newUser.email });
    // res.status(201).json({
    //   token,
    //   user: {
    //     id: newUser.id,
    //     email: newUser.email,
    //     username: newUser.username,
    //   },
    // });
  } catch (error) {
    next(error);
  }
};

exports.signout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: username }],
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(404).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ userId: user.id, email: user.email });
  } catch (error) {
    next(error);
  }
};
