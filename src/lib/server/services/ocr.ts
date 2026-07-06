import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { items, ocrNotes } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

interface OcrSpaceResponse {
	OCRExitCode: number;
	IsErroredOnProcessing: boolean;
	ProcessingTimeInMilliseconds: number;
	ParsedResults?: Array<{
		ParsedText: string;
		ErrorMessage?: string;
	}>;
	ErrorMessage?: string;
	ErrorDetails?: string;
}

async function fetchWithRetry(url: string, formData: FormData, retries: number): Promise<Response> {
	for (let attempt = 0; attempt < retries; attempt++) {
		const response = await fetch(url, { method: 'POST', body: formData });
		if (response.ok || attempt === retries - 1) return response;
		await new Promise((r) => setTimeout(r, INITIAL_DELAY * Math.pow(2, attempt)));
	}
	throw new Error('Max retries exceeded');
}

export async function processOcr(itemId: string, userId: string): Promise<{ noteId: string; content: string }> {
	const item = await db
		.select()
		.from(items)
		.where(and(eq(items.id, itemId), eq(items.userId, userId)))
		.then((r) => r[0]);

	if (!item) {
		throw new Error('Item tidak ditemukan');
	}

	if (item.type !== 'image') {
		throw new Error('OCR hanya tersedia untuk gambar');
	}

	if (!item.fileUrl) {
		throw new Error('Gambar tidak memiliki URL');
	}

	const formData = new FormData();
	formData.append('apikey', env.OCR_SPACE_API_KEY);
	formData.append('language', 'id');
	formData.append('OCREngine', '2');
	formData.append('url', item.fileUrl);

	const response = await fetchWithRetry(OCR_SPACE_URL, formData, MAX_RETRIES);

	if (!response.ok) {
		throw new Error(`OCR.space API error: ${response.status} ${response.statusText}`);
	}

	const result: OcrSpaceResponse = await response.json();

	if (result.IsErroredOnProcessing || (result.OCRExitCode !== 1 && result.OCRExitCode !== 2)) {
		throw new Error(result.ErrorMessage ?? result.ErrorDetails ?? 'OCR gagal memproses gambar');
	}

	const parsedText = result.ParsedResults?.[0]?.ParsedText?.trim();
	if (!parsedText) {
		throw new Error('OCR tidak menemukan teks pada gambar');
	}

	const [note] = await db
		.insert(ocrNotes)
		.values({
			itemId: item.id,
			content: parsedText,
			rawResponse: result
		})
		.returning({ id: ocrNotes.id });

	return { noteId: note.id, content: parsedText };
}
