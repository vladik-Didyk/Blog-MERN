export function uploadValidation(title, text, tags) {
  // Check if the title is not empty
  if (title.trim() === "") {
    alert("Title is required");
    return false;
  }

  // Check if the title length is within the desired range
  if (title.length < 5 || title.length > 100) {
    alert("Title must be between 5 and 100 characters");
    return false;
  }

  // Check if the text is not empty
  if (text.trim() === "") {
    alert("Text is required");
    return false;
  }

  // Check if the text length is within the desired range
  if (text.length < 3 || text.length > 5000) {
    alert("Text must be between 10 and 5000 characters");
    return false;
  }

  // Check if the tags are not empty
  if (tags.trim() === "") {
    alert("Tags are required");
    return false;
  }

  // Check if the tags are comma-separated and have no extra spaces
  const tagArray = tags.split(",");
  const formattedTags = tagArray.map((tag) => tag.trim());
  if (formattedTags.some((tag) => tag === "")) {
    alert("Please ensure tags are comma-separated and have no extra spaces");
    return false;
  }

  return true;
}
