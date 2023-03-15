import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  // If a token exists
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;

      // Move on to next middleware
      next();
    } catch (error) {
      console.log("🚀 ~ file: checkAuth.js:14 ~ checkAuth ~ error:", error);
      return res.status(401).json({
        message: "No access",
      });
    }
  } else {
    // If no token exists, send error response
    return res.status(403).json({
      message: "No access",
    });
  }
};
