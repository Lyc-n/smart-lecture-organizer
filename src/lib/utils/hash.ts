const SIZE = 8;

function grayscale(r: number, g: number, b: number): number {
	return 0.299 * r + 0.587 * g + 0.114 * b;
}

export async function computeImageHash(file: File): Promise<string> {
	const img = await loadImage(file);
	const canvas = document.createElement('canvas');
	canvas.width = SIZE;
	canvas.height = SIZE;
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, 0, 0, SIZE, SIZE);

	const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
	const pixels = imageData.data;

	const gray: number[] = [];
	for (let i = 0; i < pixels.length; i += 4) {
		gray.push(grayscale(pixels[i], pixels[i + 1], pixels[i + 2]));
	}

	const avg = gray.reduce((a, b) => a + b, 0) / gray.length;

	let hash = '';
	for (let i = 0; i < gray.length; i += 4) {
		let nibble = 0;
		for (let j = 0; j < 4; j++) {
			if (gray[i + j] >= avg) {
				nibble |= 1 << (3 - j);
			}
		}
		hash += nibble.toString(16);
	}

	return hash;
}

function loadImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Gagal memuat gambar'));
		};
		img.src = url;
	});
}
