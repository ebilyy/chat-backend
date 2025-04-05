import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { sequelize } from "./models";
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/roomRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("message", (message) => {
    io.emit("message", message);
  });
});

app.use(express.urlencoded({ extended: true }));



app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Chat Backend is running!");
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync({ force: true });
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

})();
