const postService = require("../services/post.service");

exports.getPost = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await postService.getPosts({ page, limit });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getPostAuthor = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const author = req.query.author || "";
    const rawTags = req.query.tags || req.query["tags[]"] || [];
    const tags = Array.isArray(rawTags) ? rawTags : [rawTags];

    const result = await postService.getPostByAuthor({
      page,
      limit,
      author,
      tags,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const result = await postService.getPostById(id);

    if (!result) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};
