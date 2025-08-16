import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { main } from '../services/aiService';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void
	) {
		cb(null, uploadDir);
	},
	filename: function (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void
	) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback
	) => {
		if (file.mimetype === 'text/plain') {
			cb(null, true);
		} else {
			cb(new Error('Only .txt files are allowed!'));
		}
	}
});

// POST /upload - upload transcript and prompt
router.post('/upload', upload.single('transcript'), async (req: Request, res: Response) => {
	const file = req.file as Express.Multer.File | undefined;
	const prompt = req.body.prompt;
	if (!file) {
		return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
	}
	if (!prompt) {
		return res.status(400).json({ error: 'Prompt is required.' });
	}
	try {
		const transcriptText = await fs.promises.readFile(file.path, 'utf-8');
		const summary = await main(transcriptText, prompt);
		res.json({
			message: 'Summary generated.',
			summary,
			transcript: transcriptText,
			prompt
		});
	} catch (err) {
		res.status(500).json({ error: 'Failed to process transcript file.' });
	}
});

export default router;
