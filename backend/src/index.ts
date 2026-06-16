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

const PORT = process.env.PORT ?? 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Socket.io ready");
});
