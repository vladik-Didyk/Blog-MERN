// Data imports
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log("🚀 ~ file: PostController.js:18 ~ create ~ error:", error)
    res.status(500).json({
        message: "Something went wrong",
    });
  }
};
