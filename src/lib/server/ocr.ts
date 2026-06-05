import { PaddleOcrService } from 'ppu-paddle-ocr';

let servicePromise: Promise<PaddleOcrService> | null = null;

async function getOcrService() {
	if (!servicePromise) {
		servicePromise = createOcrService();
	}

	return servicePromise;
}

export const MODEL_BASE =
  "https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main";

export const DICT_BASE =
  "https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main";

async function createOcrService() {
  const service = new PaddleOcrService({
    model:{
      detection: `${MODEL_BASE}/detection/PP-OCRv4_server_det_infer.onnx`,
      recognition: `${MODEL_BASE}/recognition/multi/en/v5/en_PP-OCRv5_mobile_rec_infer_int8.ort`,
      charactersDictionary: `${DICT_BASE}/recognition/multi/en/v5/ppocrv5_en_dict.txt`,
    },
    detection:{
      minimumAreaThreshold: 40,
      paddingVertical: 0.5,
      paddingHorizontal: 0.8,
    },
    debugging: {
      debug: true,
      verbose: true,
    },

    
  });

	await service.initialize();

	return service;
}

export async function recognizeImageFromUrl(imgUrl: string) {
  const response = await fetch(imgUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 OCRBot/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image. Status: ${response.status} ${response.statusText}`
    );
  }

  const contentType = response.headers.get('content-type');

  if (!contentType?.startsWith('image/')) {
    throw new Error(
      `URL did not return an image. Received content-type: ${contentType}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  const service = await getOcrService();
  await service.initialize();
  const result = await service.recognize(arrayBuffer, {
    noCache: true,
    strategy: 'per-box',
    // flatten: true,
  }
);
  // await service.destroy();
  return {
    text: result.text,
    raw: result,
  };
}