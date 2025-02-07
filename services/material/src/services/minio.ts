import * as Minio from 'minio';

const minioClient = new Minio.Client({
	endPoint: 'play.min.io',
	port: 9000,
	useSSL: true,
	accessKey: 'YOUR_ACCESS_KEY',
	secretKey: 'YOUR_SECRET_KEY',
});

const BUCKET_NAME = 'my-bucket';

export const ensureBucketExists = async () => {
	const exists = await minioClient.bucketExists(BUCKET_NAME)
	if (!exists) {
		minioClient.makeBucket(BUCKET_NAME, "eu-south-1")
		console.log("Bucket created succesfully!");

	}
}

export const addLectureMaterial = async (lectureId: number, lecture: Express.Multer.File, attachments: Express.Multer.File[]) => {
	await minioClient.putObject(BUCKET_NAME, `${lectureId}/lecture`, lecture.buffer, lecture.size);

	for (const attachment of attachments) {
		await minioClient.putObject(BUCKET_NAME, `${lectureId}/attachments/${attachment.originalname}`, attachment.buffer, attachment.size);
	}
}

export const getLectureStream = async (lectureId: number) => {
	return await minioClient.getObject(BUCKET_NAME, `${lectureId}/lecture`);
}

export const getAttachmentStream = async (lectureId: number, filename: string) => {
	const attachmentPath = `${lectureId}/attachments/${filename}`;
	return await minioClient.getObject(BUCKET_NAME, attachmentPath);
}

export const getLectureAttachments = async (lectureId: number) => {
	return minioClient.listObjectsV2(BUCKET_NAME, `${lectureId}/attachments/`, true);
}

export const deleteLectureMaterial = async (lectureId: number) => {
	await minioClient.removeObject(BUCKET_NAME, `${lectureId}/lecture`);
	const pdfStream = await getLectureAttachments(lectureId);

	const deletePromises: Promise<void>[] = [];

	pdfStream.on('data', (obj) => {
		deletePromises.push(minioClient.removeObject(BUCKET_NAME, obj.name));
	});

	pdfStream.on('error', (err) => {
		throw err;
	});

	pdfStream.on('end', async () => {
		await Promise.all(deletePromises);
	})
};

