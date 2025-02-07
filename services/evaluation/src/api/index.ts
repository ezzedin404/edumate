import express from "express";
import {
  createMultipleChoiceQuestions,
  getMultipleChoiceQuestions,
  deleteMultipleChoiceQuestion,
  deleteLectureMcqs
} from "../controllers/multipleChoiceQuestion.controller";
import {
  createWrittenQuestions,
  getWrittenQuestions,
  deleteWrittenQuestion,
  deleteLectureWqs
} from "../controllers/writtenQuestion.controller";

const router = express.Router();

router.post("/msqs", createMultipleChoiceQuestions);
router.get("/msqs", getMultipleChoiceQuestions);
router.delete("/msqs/:id", deleteMultipleChoiceQuestion);
router.delete("/msqs", deleteLectureMcqs);

router.post("/wqs", createWrittenQuestions);
router.get("/wqs", getWrittenQuestions);
router.delete("/wqs/:id", deleteWrittenQuestion);
router.delete("/wqs", deleteLectureWqs);

export default router;