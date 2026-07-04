import { browser } from '$app/environment';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'slo-theme';
const DARK_META = '#020617';
const LIGHT_META = '#fafaf9';

let currentMode = $state<ThemeMode>('light');

export function getCurrentMode(): ThemeMode {
	return currentMode;
}

export function getResolved(): 'light' | 'dark' {
	if (currentMode === 'system') {
		if (!browser) return 'light';
		return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
	}
	return currentMode;
}

function apply(theme: 'light' | 'dark') {
	if (!browser) return;
	const root = document.documentElement;
	if (theme === 'light') {
		root.classList.add('light');
	} else {
		root.classList.remove('light');
	}
	const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
	if (meta) meta.content = theme === 'light' ? LIGHT_META : DARK_META;
}

export function setTheme(mode: ThemeMode): void {
	currentMode = mode;
	if (browser) localStorage.setItem(STORAGE_KEY, mode);
	apply(getResolved());
}

let mql: MediaQueryList | null = null;

function onSystemChange() {
	if (currentMode === 'system') apply(getResolved());
}

export function init(): void {
	if (!browser) return;
	const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
	currentMode = saved ?? 'light';
	apply(getResolved());
	mql = window.matchMedia('(prefers-color-scheme: light)');
	mql.addEventListener('change', onSystemChange);
}
