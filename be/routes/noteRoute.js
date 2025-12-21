import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Note ID
 *         title:
 *           type: string
 *           description: Tiêu đề note
 *         content:
 *           type: string
 *           description: Nội dung note
 *         folderId:
 *           type: string
 *           description: ID của folder chứa note (null nếu không có)
 *         userId:
 *           type: string
 *           description: ID của user sở hữu
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Tạo note mới
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               folderId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Note đã được tạo
 *       400:
 *         description: Title và content là bắt buộc
 *       401:
 *         description: Unauthorized
 */
router.post("/", verifyToken, createNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Lấy tất cả notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *         description: Lọc notes theo folder ID
 *     responses:
 *       200:
 *         description: Danh sách notes
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Lấy note theo ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin note
 *       404:
 *         description: Note không tồn tại
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", verifyToken, getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Cập nhật note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               folderId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Note đã được cập nhật
 *       404:
 *         description: Note không tồn tại
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", verifyToken, updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Xóa note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note đã được xóa
 *       404:
 *         description: Note không tồn tại
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", verifyToken, deleteNote);

export default router;
