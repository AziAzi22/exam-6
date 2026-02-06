import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config.js";
import { UserRoles } from "../enum/user-role.enum.js";

export class Auth extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare birth_year: number;
  declare role: UserRoles;
  declare adress: string;
  declare otp: string | null;
  declare otpTime: number | null;
  declare isVerified: boolean;
  declare userpic: string;
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
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      type: DataTypes.ENUM(...Object.values(UserRoles)),
      defaultValue: "user",
      allowNull: false,
    },
    adress: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
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
