import { sequelize } from './config';
import {User, Room} from './user_room';
// import Contact from './room';
import Message from './message';

const models = {
  User,
  Room,
  Message,
};

export { sequelize, models };