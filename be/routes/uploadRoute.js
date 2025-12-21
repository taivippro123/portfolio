import express from "express";
import { uploadFile, deleteFile } from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload ảnh hoặc PDF lên Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File đã được upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                 cloudinaryId:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 fileType:
 *                   type: string
 *                   enum: [image, document]
 *                 size:
 *                   type: number
 *                 format:
 *                   type: string
 *       400:
 *         description: Vui lòng chọn file hoặc file không hợp lệ
 *       401:
 *         description: Unauthorized
 */
router.post("/", verifyToken, upload.single("file"), uploadFile);

/**
 * @swagger
 * /api/upload:
 *   delete:
 *     summary: Xóa file từ Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cloudinaryId
 *             properties:
 *               cloudinaryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: File đã được xóa
 *       404:
 *         description: File không tồn tại
 *       401:
 *         description: Unauthorized
 */
router.delete("/", verifyToken, deleteFile);

export default router;

