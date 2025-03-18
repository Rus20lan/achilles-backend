import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Fact = sequelize.define(
  "Fact",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      //   autoIncrement: true,
    },
    values: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: "Поле хранит фактические данные по каждому объему",
    },
    volumeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Внешний ключ на таблицу volumes",
      references: {
        model: "volumes",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "facts",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Fact;
