const jwt = require("../utils/jwt");

exports.protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verifyToken(token);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
