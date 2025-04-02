import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';
import Message from '../models/message';
import User from '../models/user';
import { Op as sequelizeOp } from 'sequelize';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user!.userId;

    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      res.status(404).json({ message: 'Receiver not found' });
      return;
    }

    const message = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    });

    res.status(201).json({
      id: message.id,
      content: message.content,
      sent_at: message.sent_at,
      sender_id: message.sender_id,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { contactId } = req.params;
    const userId = req.user!.userId;

    const messages = await Message.findAll({
      where: {
        [sequelizeOp.or]: [
          { sender_id: userId, receiver_id: contactId },
          { sender_id: contactId, receiver_id: userId },
        ],
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'receiver', attributes: ['id', 'username'] },
      ],
    });

    res.status(200).json({
      messages: messages.map(m => ({
        id: m.id,
        content: m.content,
        sent_at: m.sent_at,
        sender_id: m.sender_id,
        receiver_id: m.receiver_id,
        read: m.read,
      })),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};