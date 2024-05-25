const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/UserModels");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return next(
        new ApiError(
          "You are unauthorized to make this request, Login please",
          401,
        ),
      );
    }
    const token = bearerToken.split("Bearer ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || "aaaaaa");
    const user = await User.findById(payload._id);
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};
