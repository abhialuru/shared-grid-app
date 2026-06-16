import { Server, Socket } from "socket.io";
import { prisma } from "../lib/prisma.js";
import { getLeaderboardService } from "../modules/grid/grid.service.js";

const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 3000;

export function initSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    io.emit("online_count", io.engine.clientsCount);

    socket.on(
      "claim_cell",
      async (data: {
        cellId: number;
        userId: string;
        username: string;
        color: string;
      }) => {
        const { cellId, userId, username, color } = data;

        const lastClaim = cooldowns.get(userId);
        const now = Date.now();

        if (lastClaim && now - lastClaim < COOLDOWN_MS) {
          const remaining = ((COOLDOWN_MS - (now - lastClaim)) / 1000).toFixed(
            1,
          );
          socket.emit("cooldown_error", {
            message: `Wait ${remaining}s before claiming again`,
          });
          return;
        }

        try {
          const updatedCell = await prisma.cell.update({
            where: { id: cellId },
            data: {
              ownerId: userId,
              ownerName: username,
              ownerColor: color,
              capturedAt: new Date(),
            },
          });

          cooldowns.set(userId, now);

          io.emit("cell_claimed", {
            cellId: updatedCell.id,
            ownerId: userId,
            ownerName: username,
            ownerColor: color,
          });

          const leaderboard = await getLeaderboardService();
          io.emit("leaderboard_update", leaderboard);
        } catch (error) {
          console.error("[CLAIM ERROR]", error);
          socket.emit("error", { message: "Failed to claim cell" });
        }
      },
    );

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      io.emit("online_count", io.engine.clientsCount);
    });
  });
}
