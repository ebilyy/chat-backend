import { Router } from 'express';
import { getAllUsers } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
const router = Router();

router.get('/', authenticateToken, getAllUsers);

export default router;