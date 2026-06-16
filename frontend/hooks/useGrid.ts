import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";

export interface User {
  id: string;
  username: string;
  color: string;
}

export interface Cell {
  id: number;
  ownerId: string | null;
  ownerName: string | null;
  ownerColor: string | null;
  capturedAt: string | null;
}

export interface CellClaimedEvent {
  cellId: number;
  ownerId: string;
  ownerName: string;
  ownerColor: string;
}

export interface LeaderboardEntry {
  username: string;
  color: string;
  cells: number; // ← this is what's missing
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const COOLDOWN_MS = 3000;

export function useGrid(user: User) {
  const socket = useSocket();
  const [cells, setCells] = useState<Cell[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function loadCells() {
      try {
        const res = await fetch(`${API_URL}/grid/cells`);
        const data = await res.json();
        setCells(data.data);
      } catch (err) {
        console.error("Failed to load cells:", err);
      } finally {
        setIsLoading(false);
      }
    }

    async function loadLeaderboard() {
      const res = await fetch(`${API_URL}/grid/leaderboard`);
      const data = await res.json();
      setLeaderboard(data.data);
    }

    loadCells();
    loadLeaderboard();
  }, []);

  useEffect(() => {
    socket.on("cell_claimed", (event: CellClaimedEvent) => {
      setCells((prev) =>
        prev.map(
          (cell) =>
            cell.id === event.cellId
              ? {
                  ...cell,
                  ownerId: event.ownerId,
                  ownerName: event.ownerName,
                  ownerColor: event.ownerColor,
                  capturedAt: new Date().toISOString(),
                }
              : cell, // all other cells unchanged
        ),
      );
    });

    socket.on("online_count", (count: number) => {
      setOnlineCount(count);
    });

    socket.on("cooldown_error", (data: { message: string }) => {
      console.warn("Cooldown:", data.message);
    });

    return () => {
      socket.off("cell_claimed");
      socket.off("online_count");
      socket.off("cooldown_error");
      socket.off("leaderboard_update");
    };
  }, [socket]);

  const claimCell = useCallback(
    (cellId: number) => {
      if (cooldownUntil && Date.now() < cooldownUntil) return;

      socket.emit("claim_cell", {
        cellId,
        userId: user.id,
        username: user.username,
        color: user.color,
      });

      setCooldownUntil(Date.now() + COOLDOWN_MS);
    },
    [socket, user, cooldownUntil],
  );

  const myCells = cells.filter((c) => c.ownerId === user.id).length;

  const isOnCooldown = cooldownUntil ? Date.now() < cooldownUntil : false;

  return {
    cells,
    isLoading,
    onlineCount,
    myCells,
    claimCell,
    isOnCooldown,
    cooldownUntil,
    leaderboard,
  };
}
