// Data imports
import PostModel from "../models/Post.js";

/**
 * getLastTags:
 * Async function that retrieves the last 5 posts
 * from the database and returns the tags as a JSON response.
 * */
export const getLastTags = async (req, res) => {
  try {
    // Fetch the last 5 posts from the database
    const posts = await PostModel.find().limit(5).exec();

    // Extract tags from the posts, flatten the array, and limit it to the first 5 tags
    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(0, 5);

    // Send the tags as a JSON response
    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong - can't get tags",
    });
  }
};
