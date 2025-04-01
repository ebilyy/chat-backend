import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { sequelize } from "./models";
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Chat Backend is running!");
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync({ force: true });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

 
})();
