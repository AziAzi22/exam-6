import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config.js";
import { PaymentMethod } from "../enum/payment-method.enum.js";
import { OrderStatus } from "../enum/ordrer-status.enum.js";

export class OrderProduct extends Model {
  userId!: number;
  productId!: number;
  quantity!: number;
  totalPrice!: number;
  paymentMethod!: PaymentMethod;
  status!: OrderStatus;
  adress!: string;
}

OrderProduct.init(
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
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM(...Object.values(PaymentMethod)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
    },
    adress: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "order_products",
    timestamps: true,
    sequelize,
  },
);
