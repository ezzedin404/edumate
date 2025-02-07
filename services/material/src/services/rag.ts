import axios from 'axios';

const API_URL = "TODO/api/v1/stores"

export async function createStore(lectureId: number, lecTranscript: string, pdfFiles: Express.Multer.File[]): Promise<void> {
	try {
		const formData = new FormData();
		formData.append('lecture', String(lectureId));
		formData.append('text', lecTranscript);

		pdfFiles.forEach((file) => { formData.append('pdfs', new Blob([file.buffer]), file.filename); });

		const response = await axios.post(
			API_URL,
			formData,
			{ headers: { 'Content-Type': 'multipart/form-data' } }
		);

		console.log('Store created successfully:', response.status);
	} catch (error: any) {
		console.error('Error while creating store:', error.response?.data || error.message);
		throw error;
	}
}
