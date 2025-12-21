import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Upload ảnh hoặc PDF lên Cloudinary
export const uploadFile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file" });
    }

    // Kiểm tra file type
    const fileType = req.file.mimetype;
    const isImage = fileType.startsWith("image/");
    const isPDF = fileType === "application/pdf";
    const isDoc = fileType === "application/msword" || 
                  fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isImage && !isPDF && !isDoc) {
      return res.status(400).json({ message: "Chỉ chấp nhận file ảnh hoặc PDF/DOC" });
    }

    // Upload file lên Cloudinary
    const stream = Readable.from(req.file.buffer);
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: isImage ? "portfolio/images" : "portfolio/documents",
          resource_type: isImage ? "image" : "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    res.status(200).json({
      fileUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      fileName: req.file.originalname,
      fileType: isImage ? "image" : "document",
      size: uploadResult.bytes,
      format: uploadResult.format,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Upload File Error:", error);
  }
};

// Xóa file từ Cloudinary
export const deleteFile = async (req, res) => {
  try {
    const { cloudinaryId } = req.body;

    if (!cloudinaryId) {
      return res.status(400).json({ message: "cloudinaryId là bắt buộc" });
    }

    const result = await cloudinary.uploader.destroy(cloudinaryId);
    
    if (result.result === "ok") {
      res.status(200).json({ message: "File đã được xóa" });
    } else {
      res.status(404).json({ message: "File không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Delete File Error:", error);
  }
};

