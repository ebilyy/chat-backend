import { DataTypes, Model, Association } from 'sequelize';
import { sequelize } from './index';
import { Room } from './user_room';

/*
  User.associate = (models) => {

  User.belongsToMany(models.Room, {

    through: 'UserRooms',

    as: 'rooms',

    foreignKey: 'userId',

  });

};
*/
class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public online!: boolean;
  public created_at!: Date;
  public static associations: {
    rooms: Association<User, Room>;
  };
  public static associate(models: any) {
    User.belongsToMany(models.Room, {
      through: 'UserRoom',
      foreignKey: 'user_id',
      as: 'rooms',
    });
  }
  public async addRoom(room: Room): Promise<void> {
    await (this as any).addRooms(room);
  }
  public async removeRoom(room: Room): Promise<void> {
    await (this as any).removeRooms(room);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

export default User;