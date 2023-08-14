const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  // Delete file at this path:
  fs.unlink(path.join(__dirname, "..", "images", filePath), (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
