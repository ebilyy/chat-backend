import { sequelize } from './config';
import User from './user';
import Contact from './contact';
import Message from './message';

const models = {
  User,
  Contact,
  Message,
};

export { sequelize, models };