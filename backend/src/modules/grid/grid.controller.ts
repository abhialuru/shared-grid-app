import type { Request, Response } from "express";
import {
  getCellsService,
  getLeaderboardService,
  userNameService,
} from "./grid.service.js";

export const userNameController = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const user = await userNameService(username);

    if (!user) {
      return res.status(409).json({
        success: false,
        message: "Username already taken. Try another!",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Welcome to the grid!",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCellsController = async (req: Request, res: Response) => {
  try {
    const cells = await getCellsService();
    res.status(200).json({
      success: true,
      data: cells,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getLeaderboardController = async (req: Request, res: Response) => {
  try {
    const leaderboard = await getLeaderboardService();
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
