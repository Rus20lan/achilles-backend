import { DataTypes } from 'sequelize';
// const sequelize = new Sequelize('postgres');
import sequelize from '../config/db.js';

const User = sequelize.define(
  'User',
  {
    userID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default User;
