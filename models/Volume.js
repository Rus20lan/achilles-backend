import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Volume = sequelize.define(
  'Volume',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.FLOAT,
    },
    titleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'titles',
        key: 'titleID',
      },
    },
    resourceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'resources',
        key: 'id',
      },
    },
    designId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'designs',
        key: 'id',
      },
    },
  },
  {
    tableName: 'volumes',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default Volume;
