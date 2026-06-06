import { PaddleOcrService } from 'ppu-paddle-ocr';

let servicePromise: Promise<PaddleOcrService> | null = null;

async function getOcrService() {
	if (!servicePromise) {
		servicePromise = createOcrService();
	}

	return servicePromise;
}

async function createOcrService() {
	const service = new PaddleOcrService({
		debugging: {
			debug: false,
			verbose: true
		}
	});

	await service.initialize();

	return service;
}

export async function recognizeImageFromUrl(imgUrl: string) {
	const response = await fetch(imgUrl, {
		headers: {
			'user-agent': 'Mozilla/5.0 OCRBot/1.0'
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch image. Status: ${response.status} ${response.statusText}`);
	}

	const contentType = response.headers.get('content-type');

	if (!contentType?.startsWith('image/')) {
		throw new Error(`URL did not return an image. Received content-type: ${contentType}`);
	}

	const arrayBuffer = await response.arrayBuffer();
	const imageBuffer = Buffer.from(arrayBuffer);

	const service = await getOcrService();
	const result = await service.recognize(arrayBuffer);

	return {
		text: result.text,
		raw: result
	};
}
