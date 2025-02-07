import { Request, Response } from "express";
import { Course } from "../models/Course";
import { deleteCourseProgresses } from "../requests";

export const createCourse = async (req: Request, res: Response) => {
	const name = req.body.name;
	const tutorId = req.header("x-user-id")
	try {
		const course = await Course.create({ tutorId, name, likes: 0, dislikes: 0 });
		res.status(201).json(course);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const getCourse = async (req: Request, res: Response) => {
	try {
		const course = await Course.findByPk(req.params.id)
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}
		res.json(course);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}

};

export const deleteCourse = async (req: Request, res: Response) => {
	try {
		const course = await Course.findByPk(req.params.id);
		const tutorId = req.header("x-user-id");
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return
		}
		if (course.tutorId != Number(tutorId)) {
			res.status(401).json({ message: "Unauthorized" });
			return
		}
		await course.destroy();
		await deleteCourseProgresses(course.id)
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteTutorCourses = async (req: Request, res: Response) => {
	const tutorId = req.header("x-user-id");
	try {
		const courses = await Course.findAll({ attributes: ["id"], where: { tutorId }, })
		courses.forEach(c => deleteCourseProgresses(c.id))
		await Course.destroy({ where: { tutorId } });
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};
