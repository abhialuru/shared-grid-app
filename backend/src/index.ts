import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/index.js";
import gridRoutes from "./modules/grid/grid.routes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/grid", gridRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

httpServer.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Socket.io ready");
});
