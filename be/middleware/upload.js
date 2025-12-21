import multer from "multer";

// Memory storage để upload file tạm thời, sau đó upload lên Cloudinary
const storage = multer.memoryStorage();

// Upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif) hoặc PDF/DOC"));
    }
  },
});

