import { Request, Response } from "express";
import { Lecture } from "../models/Lecture";
import { deleteLectureAnswers, deleteLectureQuestions } from "../requests";
import { addLectureMaterial, deleteLectureMaterial, getAttachmentStream, getLectureAttachments, getLectureStream } from "../services/minio";
import { createStore as createVectorStore } from "../services/rag";
import { transcribeFile as transcribeVideo } from "../services/transcription";

export const createLecture = async (req: Request, res: Response) => {
	try {
		const files = req.files as { [fieldname: string]: Express.Multer.File[] };
		const videoFile = files['video'][0];
		const pdfFiles = files['pdfs'];

		const lecture = await Lecture.create({
			courseId: req.params.courseId,
			lectureName: videoFile.filename,
		});
		addLectureMaterial(lecture.id, videoFile, pdfFiles);
		createVectorStore(
			lecture.id,
			await transcribeVideo(videoFile),
			pdfFiles
		)
		res.status(201).json(lecture);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const getLecture = async (req: Request, res: Response) => {
	try {
		res.setHeader('Content-Type', 'video/mp4');
		const stream = await getLectureStream(Number(req.params.id));
		stream.pipe(res);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getAttachments = async (req: Request, res: Response) => {
	try {
		const stream = await getLectureAttachments(Number(req.params.id));
		const pdfList: string[] = [];

		stream.on('data', (obj) => pdfList.push(obj.name));
		stream.on('end', () => res.status(200).json({ pdfs: pdfList }));
		stream.on('error', (err) => {
			console.error(err);
			res.status(500).json({ error: 'Internal Server Error' });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getAttachment = async (req: Request, res: Response) => {
	try {
		const attachmentName = req.params.name;

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `attachment; filename="${attachmentName}"`);
		const attachmentStream = await getAttachmentStream(Number(req.params.id), attachmentName)
		attachmentStream.pipe(res);
		attachmentStream.on('error', (err) => {
			console.error(`Error streaming PDF file ${attachmentName}:`, err);
			res.status(500).json({ error: 'Internal Server Error' });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const getLectureInfo = async (req: Request, res: Response) => {
	try {
		const lecture = await Lecture.findByPk(req.params.id);
		if (!lecture) {
			res.status(404).json({ message: "Lecture not found" });
			return;
		}
		res.json({
			id: lecture.id,
			name: lecture.lectureName,
			courseId: lecture.courseId,
		});
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};


export const deleteLecture = async (req: Request, res: Response) => {
	try {
		const lecture = await Lecture.findByPk(req.params.id);
		const tutorId = req.header("x-user-id")
		if (!lecture) {
			res.status(404).json({ message: "Lecture not found" });
			return
		}
		if (lecture.course.tutorId != Number(tutorId)) {
			res.status(401).json({ message: "Unauthorized" });
			return
		}
		await lecture.destroy();
		await deleteLectureMaterial(lecture.id)
		await deleteLectureAnswers(lecture.id);
		await deleteLectureQuestions(lecture.id);
		res.status(204).end();
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};
