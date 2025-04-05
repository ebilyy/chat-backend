import { Router } from 'express';
import { addContact, getContacts } from '../controllers/roomController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, addContact);
router.get('/', authenticateToken, getContacts);

export default router;