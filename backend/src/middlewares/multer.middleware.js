import multer from "multer";

const upload = multer({
  // Keep the file in memory as a buffer
  storage: multer.memoryStorage(),

  // Filter to only allow PDF files
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      // Reject the file
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    // Accept the file
    cb(null, true);
  },

  // Optional: Add a file size limit (e.g., 10MB) for security
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

export { upload };