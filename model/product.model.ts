import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config.js";
import { Auth } from "./auth.model.js";

export class Product extends Model {
  id!: number;
  title!: string;
  price!: number;
  quantity!: number;
  description!: string | null;
  imageOneUrl!: string;
  imageTwoUrl?: string;
  imageThreeUrl?: string;
  imageFourUrl?: string;
  categoryId!: number;
  adminId!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    quantity: {                // ← ВАЖНО
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    imageOneUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    imageTwoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    imageThreeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    imageFourUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },

    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "products",
    timestamps: true,
    sequelize,
  },
);


