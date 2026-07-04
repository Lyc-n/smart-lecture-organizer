import { db } from '$lib/server/db';
import { items } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';

function hammingDistance(hash1: string, hash2: string): number {
	let distance = 0;
	const len = Math.min(hash1.length, hash2.length);
	for (let i = 0; i < len; i++) {
		const a = parseInt(hash1[i], 16);
		const b = parseInt(hash2[i], 16);
		let xor = a ^ b;
		while (xor > 0) {
			distance += xor & 1;
			xor >>= 1;
		}
	}
	return distance;
}

export async function findSimilarImages(
	userId: string,
	queryHash: string,
	threshold = 10
): Promise<Array<typeof items.$inferSelect & { distance: number }>> {
	const imageItems = await db
		.select()
		.from(items)
		.where(
			and(
				eq(items.userId, userId),
				eq(items.type, 'image'),
				sql`${items.fileHash} IS NOT NULL`
			)
		);

	const results = imageItems
		.map((item) => ({
			...item,
			distance: hammingDistance(queryHash, item.fileHash!)
		}))
		.filter((item) => item.distance < threshold)
		.sort((a, b) => a.distance - b.distance);

	return results;
}
