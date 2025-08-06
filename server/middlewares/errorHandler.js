module.exports = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
};
