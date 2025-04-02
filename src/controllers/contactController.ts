import { Request, Response } from 'express';
import User from '../models/user';
import Contact from '../models/contact';
import { AuthRequest } from '../middleware/auth';


export const addContact = async (req: AuthRequest, res: Response):Promise<void> => {
  try {
    const { username } = req.body;
    console.log('userId', req.user);
    const userId = req.user!.userId;

    const contactUser = await User.findOne({ where: { username } });
    if (!contactUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const existingContact = await Contact.findOne({
      where: { user_id: userId, contact_id: contactUser.id },
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

export const getContacts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const contacts = await Contact.findAll({
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