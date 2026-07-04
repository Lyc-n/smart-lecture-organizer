import { db } from '$lib/server/db';
import { groups } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const PANTEMUAN_PATTERN = /pertemuan\s+(\d+)/i;
const MAX_WEEK = 14;

export async function getRecommendedGroups(userId: string): Promise<string[]> {
	const userGroups = await db
		.select({ name: groups.name })
		.from(groups)
		.where(eq(groups.userId, userId));

	const existingNumbers: number[] = [];

	for (const group of userGroups) {
		const match = group.name.match(PANTEMUAN_PATTERN);
		if (match) {
			const num = parseInt(match[1], 10);
			if (!isNaN(num)) {
				existingNumbers.push(num);
			}
		}
	}

	if (existingNumbers.length === 0) {
		return [];
	}

	const maxWeek = Math.max(...existingNumbers);
	const suggestions: string[] = [];

	for (let i = maxWeek + 1; i <= MAX_WEEK; i++) {
		suggestions.push(`Pertemuan ${i}`);
	}

	return suggestions;
}
