import { DataTypes, Model, Association } from 'sequelize';
import { sequelize } from './index';
import { UUID } from 'node:crypto';
import { User } from './user_room';
export type RooomType = 'private' | 'public';

class Room extends Model {
  public id!: UUID;
  public name!: string;
  public created_at!: Date;
  public type!: RooomType;
  public static associations: {
    users: Association<Room, User>;
  };
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    type: {
      type: DataTypes.ENUM('private', 'public'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'rooms',
    timestamps: false,
  }
);

export default Room;