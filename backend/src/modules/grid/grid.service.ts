import { prisma } from "../../lib/prisma.js";

const COLORS = [
  "#dc2626",
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#d97706",
  "#0f766e",
  "#7c3aed",
  "#be123c",
];

function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]!;
}

export const userNameService = async (username: string) => {
  const existing = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existing) {
    return null;
  }

  const user = await prisma.user.create({
    data: {
      username,
      color: randomColor(),
    },
  });

  return user;
};

export const getCellsService = async () => {
  const cells = await prisma.cell.findMany({
    orderBy: { id: "asc" },
  });

  return cells;
};

export const getLeaderboardService = async () => {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { cells: true },
      },
    },
    orderBy: {
      cells: { _count: "desc" },
    },
    take: 10,
  });

  return users.map((user) => ({
    username: user.username,
    color: user.color,
    cells: user._count.cells,
  }));
};
