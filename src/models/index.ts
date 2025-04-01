import { sequelize } from './config';
import User from './user';
import Contact from './contact';

const models = {
  User,
  Contact,
};

export { sequelize, models };