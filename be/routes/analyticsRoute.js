import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Analytics:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         cvId:
 *           type: string
 *         ipAddress:
 *           type: string
 *         country:
 *           type: string
 *         city:
 *           type: string
 *         browser:
 *           type: string
 *         browserVersion:
 *           type: string
 *         os:
 *           type: string
 *         device:
 *           type: string
 *           enum: [mobile, desktop, tablet, unknown]
 *         userAgent:
 *           type: string
 *         referer:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     AnalyticsStats:
 *       type: object
 *       properties:
 *         totalViews:
 *           type: number
 *         uniqueIPs:
 *           type: number
 *         countryStats:
 *           type: object
 *         deviceStats:
 *           type: object
 *           properties:
 *             mobile:
 *               type: number
 *             desktop:
 *               type: number
 *             tablet:
 *               type: number
 *             unknown:
 *               type: number
 *         browserStats:
 *           type: object
 *         osStats:
 *           type: object
 *         dailyStats:
 *           type: object
 *         recentViews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Analytics'
 */

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Lấy thống kê lượt xem CV
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê analytics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsStats'
 *       404:
 *         description: CV chưa được upload
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getAnalytics);
router.get("/cv", verifyToken, getAnalytics);

export default router;
