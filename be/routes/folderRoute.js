import express from "express";
import {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} from "../controllers/folderController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Folder:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Folder ID
 *         name:
 *           type: string
 *           description: Tên folder
 *         parentId:
 *           type: string
 *           description: ID của folder cha (null nếu là root)
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
 * /api/folders:
 *   post:
 *     summary: Tạo folder mới
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Folder đã được tạo
 *       400:
 *         description: Tên folder là bắt buộc
 *       401:
 *         description: Unauthorized
 */
router.post("/", verifyToken, createFolder);

/**
 * @swagger
 * /api/folders:
 *   get:
 *     summary: Lấy tất cả folders
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách folders
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getFolders);

/**
 * @swagger
 * /api/folders/{id}:
 *   get:
 *     summary: Lấy folder theo ID
 *     tags: [Folders]
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
 *         description: Thông tin folder
 *       404:
 *         description: Folder không tồn tại
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", verifyToken, getFolderById);

/**
 * @swagger
 * /api/folders/{id}:
 *   put:
 *     summary: Cập nhật folder
 *     tags: [Folders]
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
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Folder đã được cập nhật
 *       404:
 *         description: Folder không tồn tại
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", verifyToken, updateFolder);

/**
 * @swagger
 * /api/folders/{id}:
 *   delete:
 *     summary: Xóa folder
 *     tags: [Folders]
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
 *         description: Folder đã được xóa
 *       400:
 *         description: Không thể xóa folder có chứa folder con
 *       404:
 *         description: Folder không tồn tại
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", verifyToken, deleteFolder);

export default router;
