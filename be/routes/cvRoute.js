import express from "express";
import {
  uploadCV,
  getCV,
  getCVInfo,
  deleteCV,
} from "../controllers/cvController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CV:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         fileName:
 *           type: string
 *         fileUrl:
 *           type: string
 *         cloudinaryId:
 *           type: string
 *         fileType:
 *           type: string
 *           enum: [pdf, doc, docx]
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/cv/public:
 *   get:
 *     summary: Lấy CV mới nhất (Public - không cần auth)
 *     tags: [CV]
 *     responses:
 *       200:
 *         description: Thông tin CV
 *       404:
 *         description: CV chưa được upload
 */
router.get("/public", getCV);

/**
 * @swagger
 * /api/cv:
 *   post:
 *     summary: Upload CV mới (replace CV cũ nếu có)
 *     tags: [CV]
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
 *       201:
 *         description: CV đã được upload
 *       400:
 *         description: Vui lòng chọn file CV hoặc file không hợp lệ
 *       401:
 *         description: Unauthorized
 */
router.post("/", verifyToken, upload.single("file"), uploadCV);

/**
 * @swagger
 * /api/cv:
 *   get:
 *     summary: Lấy thông tin CV (Admin - cần auth)
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin CV
 *       404:
 *         description: CV chưa được upload
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getCVInfo);

/**
 * @swagger
 * /api/cv:
 *   delete:
 *     summary: Xóa CV
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CV đã được xóa
 *       404:
 *         description: CV không tồn tại
 *       401:
 *         description: Unauthorized
 */
router.delete("/", verifyToken, deleteCV);

export default router;
