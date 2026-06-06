import { OcrRepository } from '../repositories/ocr.repository';

export const OcrService = {
	create(materialId: string, extractedText: string) {
		return OcrRepository.create({ materialId, extractedText });
	}
};
