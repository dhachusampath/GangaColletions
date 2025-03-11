const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the uploads directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Uploads folder in the root of your project
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Appends timestamp to ensure unique filenames
  },
});
const upload = multer({ storage });

module.exports = upload;
