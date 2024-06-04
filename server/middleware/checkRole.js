const ApiError = require("../utils/ApiError");
const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!role.includes(userRole)) {
        next(new ApiError(`Kamu bukan tidak bisa akses ini`, 401));
      }

      next();
    } catch (error) {
      next(new ApiError(error.message, 400));
    }
  };
};

module.exports = checkRole;
