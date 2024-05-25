const multer = require("multer");
const ApiError = require("../utils/ApiError");

const fileFilters = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    return cb(new ApiError("File not supported", 400));
  }
};

const upload = multer({
  fileFilter: fileFilters,
});

module.exports = upload;
