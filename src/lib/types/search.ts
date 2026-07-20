export const PAGE_SIZE = 20;

export type Section = 'items' | 'groups' | 'notes';

export type SearchItem = {
	id: string;
	name: string;
	type: string;
	mimeType: string | null;
	fileSize: number | null;
	fileUrl: string | null;
	thumbnailUrl: string | null;
	distance?: number;
};

export type SearchGroup = {
	id: string;
	name: string;
	subtitle: string | null;
	color: string;
	icon: string;
};

export type SearchNote = {
	note: { id: string; content: string };
	itemId: string;
	itemName: string;
};

export type SearchResult = {
	items: SearchItem[];
	groups: SearchGroup[];
	notes: SearchNote[];
	hasMoreItems: boolean;
	hasMoreGroups: boolean;
	hasMoreNotes: boolean;
};
