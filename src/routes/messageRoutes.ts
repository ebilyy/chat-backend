import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { sendMessage, getMessages } from '../controllers/messageController';

const router = Router();

router.post('/', authenticateToken, sendMessage);
router.get('/:contactId', authenticateToken, getMessages);

export default router;
