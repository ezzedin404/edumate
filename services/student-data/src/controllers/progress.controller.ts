import { Request, Response } from "express";
import { Progress } from "../models/Progress";

export const createProgress = async (req: Request, res: Response) => {
	const courseId = req.body.courseId;
	const studentId = req.header("x-user-id");
	try {
		const progress = await Progress.create({ studentId, courseId, currentLecture: 0, examSolved: false });
		res.status(201).json(progress);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const getProgress = async (req: Request, res: Response) => {
	try {
		const studentId = req.header("x-user-id");
		const progress = await Progress.findByPk(req.params.id);
		if (!progress) {
			res.status(404).json({ message: "Progress not found" });
			return;
		}
		if (progress.studentId != Number(studentId)) {
			res.status(401).json({ message: "Unauthorized" });
			return
		}
		res.json(progress);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};


export const updateProgress = async (req: Request, res: Response) => {
	try {
		const studentId = req.header("x-user-id");
		const progress = await Progress.findByPk(req.params.id);
		if (!progress) {
			res.status(404).json({ message: "Progress not found" });
			return;
		}
		if (progress.studentId != Number(studentId)) {
			res.status(401).json({ message: "Unauthorized" });
			return
		}
		progress.currentLecture = req.body.currentLecture;
		progress.examSolved = req.body.examSolved;
		await progress.save();
		res.json(progress);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteProgress = async (req: Request, res: Response) => {
	try {
		const studentId = req.header("x-user-id");
		const progress = await Progress.findByPk(req.params.id);
		if (!progress) {
			res.status(404).json({ message: "Progress not found" });
			return
		}
		if (progress.studentId != Number(studentId)) {
			res.status(401).json({ message: "Unauthorized" });
			return
		}
		await progress.destroy();
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteProgresses = async (req: Request, res: Response) => {
	try {
		const studentId = req.header("x-user-id");
		let filter: { studentId?: string, courseId?: string };
		if (studentId) {
			filter = { studentId: String(studentId) };
		} else if (req.query.courseId) {
			filter = { courseId: String(req.query.courseId) };
		} else {
			res.status(400).json({ message: "No studentId or courseId provided" });
			return;
		}
		Progress.destroy({ where: filter })
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};
