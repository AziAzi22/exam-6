import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config.js";
import { Auth } from "./auth.model.js";

export class Category extends Model {
  id!: number;
  title!: string;
  imageUrl!: string;
  adminId!: number;
}

Category.init(
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "categories",
    timestamps: true,
    sequelize,
  },
);

Auth.hasMany(Category, { foreignKey: "adminId" });
Category.belongsTo(Auth, { foreignKey: "adminId" });
