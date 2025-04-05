import { Request, Response } from 'express';
import { models } from '../models';
import { AuthRequest } from '../middleware/auth';


export const createPublicRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const room = await models.Room.create({
      name,
      type: 'public',
    });
    res.status(201).json({ roomId: room.id, name: room.name, type: room.type });
  } catch (error) {
    console.error('Error creating private room:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const createPersonalRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { user1, user2 } = req.body;

    const room = await models.Room.create({
      name: `${user1}-${user2}`,
      type: 'private',
    });
    const firstUser = await models.User.findOne({ where: { id: user1 } });
    const secondUser = await models.User.findOne({ where: { id: user2 } });

    if (!firstUser || !secondUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    firstUser.addRoom(room);
    secondUser.addRoom(room);
    res.status(201).json({ roomId: room.id, name: room.name, type: room.type });
  } catch (error) {
    console.error('Error creating personal room:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getUserRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const rooms = await models.Room.findAll({
      where: { user_id: userId },
      include: [
        {
          model: models.User,
          as: 'users',
          attributes: ['id', 'username', 'online'],
        },
      ],
    });

    res.status(200).json({ rooms });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addUserToRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, roomId } = req.body;

    const user = await models.User.findOne({ where: { id: userId } });
    const room = await models.Room.findOne({ where: { id: roomId } });

    if (!user || !room) {
      res.status(404).json({ message: 'User or room not found' });
      return;
    }

    await user.addRoom(room);
    res.status(200).json({ message: 'User added to room successfully' });
  } catch (error) {
    console.error('Error adding user to room:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const removeUserFromRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, roomId } = req.body;

    const user = await models.User.findOne({ where: { id: userId } });
    const room = await models.Room.findOne({ where: { id: roomId } });

    if (!user || !room) {
      res.status(404).json({ message: 'User or room not found' });
      return;
    }

    await user.removeRoom(room);
    res.status(200).json({ message: 'User removed from room successfully' });
  } catch (error) {
    console.error('Error removing user from room:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.body;

    const room = await models.Room.findOne({ where: { id: roomId } });

    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    await room.destroy();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Server error' });
  }
}