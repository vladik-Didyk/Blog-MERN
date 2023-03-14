// Data imports
import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log("🚀 ~ file: PostController.js:9 ~ getAll ~ error:", error);
    res.status(500).json({
      message: "Something went wrong - can't get posts",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.log("🚀 ~ file: PostController.js:32 ~ getOne ~ error:", error);
    res.status(500).json({
      message: "Something went wrong - can't get post",
    });
  }
};

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
    console.log("🚀 ~ file: PostController.js:18 ~ create ~ error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletePost = await PostModel.findOneAndDelete({
      _id: postId,
    });

    if (!deletePost) {
      return res.status(404).json({ message: "Post was not deleted" });
    }
    res.json({
      message: "Post was deleted",
    });
  } catch (error) {
    console.log("🚀 ~ file: PostController.js:32 ~ getOne ~ error:", error);
    res.status(500).json({
      message: "Something went wrong - can't get posts",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post was not updated" });
    }
    res.json({
      success: "Post was updated",
    });
  } catch (error) {
    console.log("🚀 ~ file: PostController.js:103 ~ update ~ error:", error)
    res.status(500).json({
      message: "Something went wrong - can't get posts",
    });
  }
};
