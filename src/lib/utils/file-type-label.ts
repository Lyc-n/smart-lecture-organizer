export function getFileTypeLabel(fileName: string, mimeType: string): string {
	const extension = fileName.split('.').pop()?.toUpperCase();
	if (extension && extension.length <= 6) return extension;

	const mimeMap: Record<string, string> = {
		'application/pdf': 'PDF',
		'text/plain': 'TXT',
		'application/msword': 'DOC',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
		'application/vnd.ms-powerpoint': 'PPT',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
		'image/png': 'PNG',
		'image/jpeg': 'JPG'
	};

	return mimeMap[mimeType] ?? 'FILE';
}
