import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config.js";

export class SavedProduct extends Model {
  userId!: number;
  SavedId!: number;
}

SavedProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SavedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "saved_products",
    timestamps: true,
    sequelize,
  },
);
