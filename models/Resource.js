import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Resource = sequelize.define(
  'Resource',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'resources',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default Resource;
