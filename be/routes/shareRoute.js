import express from "express";
import { getSharedContent } from "../controllers/shareController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SharedContent:
 *       type: object
 *       properties:
 *         folders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Folder'
 *         notes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Note'
 *         notesByFolder:
 *           type: object
 *           additionalProperties:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Note'
 */

/**
 * @swagger
 * /api/share:
 *   get:
 *     summary: Lấy tất cả folders và notes được share (Public - không cần auth)
 *     tags: [Share]
 *     responses:
 *       200:
 *         description: Danh sách folders và notes được share
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SharedContent'
 *       500:
 *         description: Server Error
 */
router.get("/", getSharedContent);

export default router;

