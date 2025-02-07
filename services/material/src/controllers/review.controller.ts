import { Request, Response } from "express";
import { Review } from "../models/Review";

export const createReview = async (req: Request, res: Response) => {
	const { courseId, score } = req.body;
	const studentId = req.header("x-user-id");
	try {
		const review = await Review.create({ studentId, courseId, score });
		res.status(201).json(review);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const getReviewsAverage = async (req: Request, res: Response) => {
	try {
		const reviews = await Review.findAll({ where: { courseId: req.query.courseId } });
		let sum = 0;
		reviews.forEach(r => sum += r.score);
		res.json({ average: sum / reviews.length });
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};
export const getStudentReview = async (req: Request, res: Response) => {
	const studentId = req.header("x-user-id");
	try {
		const review = (await Review.findAll({ where: { studentId } }));
		if (!review.length) {
			res.status(404).json({ message: "Review not found" });
			return;
		}
		res.json(review.at(0));
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};


export const updateStudentReview = async (req: Request, res: Response) => {
	const studentId = req.header("x-user-id");
	try {
		const review = await Review.findAll({ where: { studentId } });
		if (!review.length) {
			res.status(404).json({ message: "Review not found" });
			return;
		}
		review.at(0).score = req.body.score;
		await review.at(0).save();
		res.json(review);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteStudentReview = async (req: Request, res: Response) => {
	const studentId = req.header("x-user-id");
	try {
		const review = await Review.findAll({ where: { studentId } });
		if (!review.length) {
			res.status(404).json({ message: "Review not found" });
			return
		}
		await review.at(0).destroy();
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};
