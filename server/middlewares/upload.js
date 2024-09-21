const multer = require('multer');

// Use memoryStorage to store file in memory
const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)!'));
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5 // 5MB
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

module.exports = upload; // Ensure upload is exported correctly
