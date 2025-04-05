import { Router } from 'express';
import { createPublicRoom, getUserRooms, addUserToRoom, deleteRoom, removeUserFromRoom } from '../controllers/roomController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createPublicRoom);
router.get('/', authenticateToken, getUserRooms);
router.post('/:room_id', authenticateToken, addUserToRoom);
router.patch('/:room_id', authenticateToken, removeUserFromRoom);

router.delete('/:room_id', authenticateToken, deleteRoom);


export default router;