import express from 'express';
import {createUser, loginUser, logoutUser, verifyUser} from '../controllers/userController.js';
import {verifyToken} from '../middleware/auth.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/verify', verifyToken, verifyUser);
export default router;