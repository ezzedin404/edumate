import express from "express";
import {
  createAnswer,
  getAnswer,
  deleteAnswers
} from "../controllers/answer.controller";
import {
  createProgress,
  getProgress,
  updateProgress,
  deleteProgress,
  deleteProgresses,
} from "../controllers/progress.controller";

const router = express.Router();

router.post("/answers", createAnswer);
router.get("/answers/:id", getAnswer);
router.delete("/answers", deleteAnswers);

router.post("/progresses", createProgress);
router.get("/progresses/:id", getProgress);
router.put("/progresses/:id", updateProgress);
router.delete("/progresses/:id", deleteProgress);
router.delete("/progresses", deleteProgresses);

export default router;