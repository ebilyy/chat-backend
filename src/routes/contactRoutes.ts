import { Router } from 'express';
import { addContact, getContacts } from '../controllers/contactController';

const router = Router();

router.post('/', addContact);
router.get('/', getContacts);

export default router;