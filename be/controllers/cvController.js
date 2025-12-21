import CV from "../models/CVModel.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import { recordCVView } from "./analyticsController.js";

// Upload CV mới (replace CV cũ nếu có)
export const uploadCV = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file CV" });
    }

    // Kiểm tra file type
    const fileType = req.file.mimetype;
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ message: "Chỉ chấp nhận file PDF hoặc DOC/DOCX" });
    }

    // Xóa CV cũ nếu có
    const oldCV = await CV.findOne({ userId });
    if (oldCV) {
      try {
        await cloudinary.uploader.destroy(oldCV.cloudinaryId);
      } catch (error) {
        console.log("Error deleting old CV from Cloudinary:", error);
      }
      await CV.findByIdAndDelete(oldCV._id);
    }

    // Upload file lên Cloudinary
    const stream = Readable.from(req.file.buffer);
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio/cv",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    // Lưu thông tin CV vào database
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    const newCV = new CV({
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      fileType: fileExtension,
      userId,
    });

    await newCV.save();
    res.status(201).json(newCV);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Upload CV Error:", error);
  }
};

// Lấy CV mới nhất (public - không cần auth)
export const getCV = async (req, res) => {
  try {
    // Lấy CV mới nhất (chỉ có 1 CV cho mỗi user)
    const cv = await CV.findOne().sort({ createdAt: -1 });
    
    if (!cv) {
      return res.status(404).json({ message: "CV chưa được upload" });
    }

    // Ghi lại analytics (async, không block response)
    const analyticsData = {
      ipAddress: req.ip || req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress || req.socket.remoteAddress || "unknown",
      userAgent: req.get("user-agent") || "unknown",
      referer: req.get("referer") || "direct",
    };

    // Gọi recordCVView async (không đợi kết quả để không block response)
    recordCVView(cv._id, analyticsData).catch((err) => {
      console.error("Error recording CV view:", err);
    });

    res.status(200).json({
      fileUrl: cv.fileUrl,
      fileName: cv.fileName,
      fileType: cv.fileType,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get CV Error:", error);
  }
};

// Lấy thông tin CV (admin - cần auth)
export const getCVInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const cv = await CV.findOne({ userId });
    
    if (!cv) {
      return res.status(404).json({ message: "CV chưa được upload" });
    }

    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get CV Info Error:", error);
  }
};

// Xóa CV
export const deleteCV = async (req, res) => {
  try {
    const userId = req.user.id;
    const cv = await CV.findOne({ userId });
    
    if (!cv) {
      return res.status(404).json({ message: "CV không tồn tại" });
    }

    // Xóa file từ Cloudinary
    try {
      await cloudinary.uploader.destroy(cv.cloudinaryId);
    } catch (error) {
      console.log("Error deleting CV from Cloudinary:", error);
    }

    await CV.findByIdAndDelete(cv._id);
    res.status(200).json({ message: "CV đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Delete CV Error:", error);
  }
};

