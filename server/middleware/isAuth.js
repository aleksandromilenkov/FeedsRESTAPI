const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      return next(error);
    }
    const decodedToken = jwt.verify(token, "my secrett");
    if (!decodedToken) {
      const error = new Error("not authenticated");
      error.statusCode = 401;
      return next(error);
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    err.statusCode = 500;
    return next(err);
  }
};
