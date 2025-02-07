import { Request, Response } from "express";
import { WrittenQuestion } from "../models/WrittenQuestion";
import { isLectureOwner } from "../services/material";

export const createWrittenQuestions = async (req: Request, res: Response) => {
  try {
    const questionsRequest: {lectureId: number, questions: {question: string, answer: string}[]} = req.body;
		if (!isLectureOwner(Number(req.header("x-user-id")), questionsRequest.lectureId)) {
			res.status(400).json({ message: "Lecture not found or you are not its owener" });
			return
		}
    const records = questionsRequest.questions.map<{
      lectureId: number, 
      question: string, 
      answer: string
    }>(
      q => { return { lectureId: questionsRequest.lectureId, question: q.question, answer: q.answer } }
    );
    const questions = await WrittenQuestion.bulkCreate(records);
    res.status(201).json(questions);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getWrittenQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await WrittenQuestion.findAll({ where: { lectureId: req.query.lectureId } });
    if (!questions.length) {
      res.status(404).json({ message: "No written question found" });
      return;
    }
    res.json(questions);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteWrittenQuestion = async (req: Request, res: Response) => {
  try {
    const question = await WrittenQuestion.findByPk(req.params.id);
    if (!question) {
      res.status(404).json({ message: "Written question not found" });
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

export const deleteLectureWqs = async (req: Request, res: Response) => {
  try {
		if (!isLectureOwner(Number(req.header("x-user-id")), Number(req.query.lectureId))) {
			res.status(400).json({ message: "Lecture not found or you are not its owener" });
			return
		}
    await WrittenQuestion.destroy({where: {lectureId: req.query.lectureId}});
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
