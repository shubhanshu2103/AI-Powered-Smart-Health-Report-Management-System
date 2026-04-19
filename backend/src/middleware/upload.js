const multer = require('multer');
const path = require('path');

const ALLOWED = new Set(['.pdf', '.txt', '.png', '.jpg', '.jpeg', '.webp']);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  ALLOWED.has(ext) ? cb(null, true) : cb(new Error('Unsupported file type.'), false);
};

// Memory storage — files go to Supabase Storage, not local disk
module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
