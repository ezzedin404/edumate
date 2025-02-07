import express from "express";
import {
  createCourse,
  getCourse,
  deleteCourse,
  deleteTutorCourses,
} from "../controllers/course.controller";
import {
  createLecture,
	getLecture,
	getLectureInfo,
	getAttachment,
	getAttachments,
  deleteLecture,
} from "../controllers/lecture.controller";
import {
  createReview,
  getStudentReview,
  updateStudentReview,
  deleteStudentReview,
} from "../controllers/review.controller";

const router = express.Router();

router.post("/courses", createCourse);
router.get("/courses/:id", getCourse);
router.delete("/courses/:id", deleteCourse);
router.delete("/courses", deleteTutorCourses);

router.post("/courses/:courseId/lectures", createLecture);
router.get("/lectures/:id", getLectureInfo);
router.get("/lectures/:id/video", getLecture);
router.get("/lectures/:id/attachments", getAttachments);
router.get("/lectures/:id/attachments/:attachmentName", getAttachment);
router.delete("/lectures/:id", deleteLecture);

router.post("/reviews", createReview);
router.get("/reviews", getStudentReview);
router.put("/reviews", updateStudentReview);
router.delete("/reviews", deleteStudentReview);

export default router;
