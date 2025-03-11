import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Title = sequelize.define(
  'Title',
  {
    titleID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brevis: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    title_code: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'titles',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default Title;
