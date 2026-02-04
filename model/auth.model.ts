import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config.js";

export class Auth extends Model {
  id!: number;
  username!: string;
  email!: string;
  password!: string;
  birth_year!: number;
  role!: "admin" | "user" | "superadmin";
  otp!: string | null;
  otpTime!: number | null;
  isVerified!: boolean;
  userpic!: string;
}

Auth.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birth_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userpic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "superadmin"),
      defaultValue: "user",
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otpTime: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    sequelize,
  },
);
