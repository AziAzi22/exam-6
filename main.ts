import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
// import sequelize from "./config/config.js"; 
dotenv.config();


const app = express();

// cookies 

app.use(cookieParser());

app.use(cors());
app.use(express.json());

// routers

app.use(authRouter)


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running an port: ${PORT}`);
});
