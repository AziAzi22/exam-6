import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: String(process.env.DB_PASSWORD as string),
  database: String(process.env.DB_NAME as string),
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log(error.message));

  // sequelize.sync({ force: false });
  
  // sequelize.sync({ alter: true })


export default sequelize;
