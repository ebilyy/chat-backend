import { Request, Response } from 'express';
import { models } from '../models';
import { AuthRequest } from '../middleware/auth';


export const addRoom = async (req: AuthRequest, res: Response):Promise<void> => {
  try {
    const userId = req.user!.userId;

    const roomUser = await models.User.findOne({ where: { id: userId } });
    if (!roomUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // const existingRoom = await models.Room.findOne({
    //   where: { user_id: userId, _id: contactUser.id },
    // });
    const roomWithUsers = await models.Room.findOne({
      where: { id: room.id },
      include: [{ model: models.User, as: 'users' }],
    });
    if (existingContact) {
      res.status(400).json({ message: 'Contact already exists' });
      return;
    }

    const contact = await Contact.create({
      user_id: userId,
      contact_id: contactUser.id,
    });

    res.status(201).json({ contactId: contact.contact_id });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type } = req.body;
    const room = await models.Room.create({
      name,
      type,
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

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const contacts = await Room.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'username', 'online'],
        },
      ],
    });

    res.status(200).json({
      contacts: contacts.map(c => ({
        id: c.contact_id,
        username: c.contact!.username,
        online: c.contact!.online,
      })),
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};