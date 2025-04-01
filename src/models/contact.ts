import { DataTypes, Model, Association } from 'sequelize';
import { sequelize } from './index';
import User from './user';

class Contact extends Model {
  public id!: number;
  public user_id!: number;
  public contact_id!: number;
  public added_at!: Date;
  public contact?: User;

  public static associations: {
    contact: Association<Contact, User>;
  };
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'contacts',
    timestamps: false,
  }
);

User.hasMany(Contact, { foreignKey: 'user_id', as: 'contacts' });
Contact.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Contact.belongsTo(User, { foreignKey: 'contact_id', as: 'contact' });

export default Contact;