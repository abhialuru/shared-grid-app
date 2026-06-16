import { Router } from "express";
import {
  getCellsController,
  getLeaderboardController,
  userNameController,
} from "./grid.controller.js";

const router = Router();

router.post("/join", userNameController);
router.get("/cells", getCellsController);
router.get("/leaderboard", getLeaderboardController);

export default router;
