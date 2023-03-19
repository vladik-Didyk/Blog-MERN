// Import mongoose package
import mongoose from "mongoose";

// Create a new schema for the post model
const PostSchema = new mongoose.Schema(
  {
    // Define the title field with type of string and it's required
    title: {
      type: String,
      required: true,
    },

    // Define the text field with type of string and it's required
    text: {
      type: String,
      required: true,
    },

    // Define the tags field with type of array and default value is empty array
    tags: {
      type: Array,
      default: [],
    },

    // Define the viewCount field with type of number
    viewCount: {
      type: Number,
    },

    // Define the avatarUrl field with type of string
    avatarUrl: String,

    // Define the user field with type of mongoose.Schema.Types.ObjectId, ref to User model and it's required
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Define the avatarUrl field with type of string
    imageUrl: String,
  },

  // Define schema options, add timestamps option which adds createdAt and updatedAt fields
  {
    timestamps: true,
  }
);

// Export Post model with the PostSchema
export default mongoose.model("Post", PostSchema);
