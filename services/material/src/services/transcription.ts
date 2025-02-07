import axios from "axios";

const API_URL = "TODO/api/v1/transcribe"

interface TranscriptionResponse {
	transcription: string;
}

export async function transcribeFile(file: Express.Multer.File): Promise<string> {
	try {
		const formData = new FormData();
		formData.append('file', new Blob([file.buffer]), file.originalname);

		const response = await axios.post<TranscriptionResponse>(
			API_URL,
			formData,
			{ headers: { 'Content-Type': 'multipart/form-data' } }
		);

		return response.data.transcription;
	} catch (error: any) {
		console.error('Error while transcribing file:', error.response?.data || error.message);
		throw error;
	}
};
