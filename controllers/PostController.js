// Data imports
import PostModel from "../models/Post.js";

/**
 * getAll: async function that tries to retrieve all posts from the database using the PostModel.
 * If successful, it sends the retrieved posts to the client as a JSON response.
 * If there is an error, it logs the error to the console and sends an error response
 * to the client with a status of 500 and a message of "Something went wrong - can't get posts".
 */

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

/**
 * getOne: async function that tries to retrieve a single post by ID from the database using the PostModel.
 * If successful, it increments the view count of the retrieved post,
 * sends the updated post to the client as a JSON response.
 * If there is no post found, it sends an error response to the client with
 * a status of 404 and a message of "Post not found".
 * If there is an error, it logs the error to the console and sends an error response to the client
 * with a status of 500 and a message of "Something went wrong - can't get post".
 */

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

/**
 * create: async function that tries to create a new post in the database using the PostModel.
 * If successful, it sends the newly created post to the client as a JSON response.
 * If there is an error, it logs the error to the console and sends an error response
 * to the client with a status of 500 and a message of "Something went wrong".
 */

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

/**
 * remove: async function that tries to remove a single post by ID from the database using the PostModel.
 * If successful, it sends a success message to the client as a JSON response.
 * If there is no post found, it sends an error response to the client with a status of 404 and a message of
 * "Post was not deleted". If there is an error,
 * it logs the error to the console and sends an error response to the
 * client with a status of 500 and a message of "Something went wrong - can't get posts".
 */

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

/**
 * update: async function that tries to update a single post by ID in the database using the PostModel.
 * If successful, it sends a success message to the client as a JSON response.
 * If there is no post found, it sends an error response to the client with a status of 404 and a message
 * of "Post was not updated".
 * If there is an error, it logs the error to the console and sends an error response
 * to the client with a status of 500 and a message of "Something went wrong - can't get posts".
 */
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
    console.log("🚀 ~ file: PostController.js:103 ~ update ~ error:", error);
    res.status(500).json({
      message: "Something went wrong - can't get posts",
    });
  }
};
