import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	server: {
		host: true,
		allowedHosts: ['sterling-wren-modern.ngrok-free.app']
	},
	optimizeDeps: {
		exclude: ['@napi-rs/canvas']
	},

	build: {
		rollupOptions: {
			external: ['@napi-rs/canvas']
		}
	},

	ssr: {
		external: ['@napi-rs/canvas']
	},

	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'prompt',
			injectRegister: false,
			includeAssets: ['favicon.svg', 'pwa-192.svg', 'pwa-512.svg'],
			manifest: {
				name: 'Smart Lecture Organizer',
				short_name: 'SLO',
				description: 'Organize your lectures, notes, and study materials',
				theme_color: '#3b82f6',
				background_color: '#ffffff',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				icons: [
					{ src: 'pwa-192.svg', sizes: '192x192', type: 'image/svg+xml' },
					{ src: 'pwa-512.svg', sizes: '512x512', type: 'image/svg+xml' },
					{ src: 'pwa-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' }
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,woff2}'],
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
				runtimeCaching: [
					{
						urlPattern: '\\/api\\/.*',
						handler: 'NetworkFirst',
						options: {
							cacheName: 'api-cache',
							expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
							cacheableResponse: { statuses: [0, 200] }
						}
					}
				]
			}
		})
	],

	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
