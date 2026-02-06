import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config.js";

export class SavedProduct extends Model {
  userId!: number;
  ProductId!: number;
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
      references: {
        model: "users",
        key: "id",
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      }
    },
  },
  {
    tableName: "saved_products",
    timestamps: true,
    sequelize,
  },
);
