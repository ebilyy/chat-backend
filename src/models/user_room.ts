import User from './user';
import Room from './room';

// Define the many-to-many relationship
User.belongsToMany(Room, { through: 'UserRoom', foreignKey: 'user_id', as: 'rooms' });
Room.belongsToMany(User, { through: 'UserRoom', foreignKey: 'room_id', as: 'users' });

export { User, Room };