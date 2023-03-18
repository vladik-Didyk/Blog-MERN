/**
 * Define the 'uploadImage' controller
 * function that takes two arguments:
 * the request (req) and the response (res)
 *   */
export const uploadImage = (req, res) => {
  // Send a successful response (HTTP 200 status code) with a JSON object containing the URL of the uploaded file
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
};
