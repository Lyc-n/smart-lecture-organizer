import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'$lib': path.resolve('./src/lib'),
			'$lib/server': path.resolve('./src/lib/server'),
			'$app': path.resolve('./src/app')
		}
	},
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node'
	}
});
