import { Request, Response } from "express";
import { Answer } from "../models/Answer";

export const createAnswer = async (req: Request, res: Response) => {
	const { lectureId, mcqAnswers, writtenAnswers } = req.body;
	const studentId = req.header("x-user-id")
	try {
		const answer = await Answer.create({ lectureId, studentId, mcqAnswers, writtenAnswers });
		res.status(201).json(answer);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const getAnswer = async (req: Request, res: Response) => {
	try {
		const studentId = req.header("x-user-id")
		const answer = await Answer.findByPk(req.params.id)
		if (!answer) {
			res.status(404).json({ message: "Answer not found" });
			return;
		}
		if (answer.studentId != Number(studentId)) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}
		res.json(answer);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteAnswers = async (req: Request, res: Response) => {
	try {
		const studentId = req.header("x-user-id")
		let filter: { studentId?: string, lectureId?: string };
		if (studentId) {
			filter = { studentId: String(studentId) };
		} else if (req.query.lectureId) {
			filter = { lectureId: String(req.query.lectureId) };
		} else {
			res.status(400).json({ message: "No studentId or lectureId provided" });
			return;
		}
		Answer.destroy({ where: filter })
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};
