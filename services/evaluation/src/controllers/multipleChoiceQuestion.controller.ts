import { Request, Response } from "express";
import { MultipleChoiceQuestion } from "../models/MultipleChoiceQuestion";
import { isLectureOwner } from "../services/material";

export const createMultipleChoiceQuestions = async (req: Request, res: Response) => {
	try {
		const questionsRequest: { lectureId: number, questions: { choices: string[], answerId: number }[] } = req.body;
		if (!isLectureOwner(Number(req.header("x-user-id")), questionsRequest.lectureId)) {
			res.status(400).json({ message: "Lecture not found or you are not its owener" });
			return
		}
		const records = questionsRequest.questions.map<{
			lectureId: number,
			choices: string,
			answerId: number
		}>(
			q => { return { lectureId: questionsRequest.lectureId, answerId: q.answerId, choices: q.choices.join("<sep>") } }
		);
		const questions = await MultipleChoiceQuestion.bulkCreate(records);
		res.status(201).json(questions);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const getMultipleChoiceQuestions = async (req: Request, res: Response) => {
	try {
		const questions = await MultipleChoiceQuestion.findAll({ where: { lectureId: req.query.lectureId } });
		if (!questions.length) {
			res.status(404).json({ message: "No multiple-choice question found" });
			return;
		}
		res.json(questions);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteMultipleChoiceQuestion = async (req: Request, res: Response) => {
	try {
		const question = await MultipleChoiceQuestion.findByPk(req.params.id);
		if (!question) {
			res.status(404).json({ message: "Multiple-choice question not found" });
			return;
		}
		if (!isLectureOwner(Number(req.header("x-user-id")), Number(question.lectureId))) {
			res.status(400).json({ message: "Lecture not found or you are not its owener" });
			return
		}
		question.destroy();
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteLectureMcqs = async (req: Request, res: Response) => {
	try {
		if (!isLectureOwner(Number(req.header("x-user-id")), Number(req.query.lectureId))) {
			res.status(400).json({ message: "Lecture not found or you are not its owener" });
			return
		}
		await MultipleChoiceQuestion.destroy({ where: { lectureId: req.query.lectureId } });
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
}
