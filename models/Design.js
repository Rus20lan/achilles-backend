import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Design = sequelize.define(
  'Design',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    brevis: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    mark: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'designs',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default Design;
