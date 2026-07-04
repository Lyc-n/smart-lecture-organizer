declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				email: string;
				emailVerified: boolean | null;
				name: string | null;
				image?: string | null;
				storageUsed?: number;
				storageLimit?: number;
			} | null;
			session: {
				id: string;
				expiresAt: Date;
				token: string;
				createdAt: Date;
				updatedAt: Date;
				ipAddress?: string | null;
				userAgent?: string | null;
				userId: string;
			} | null;
		}
	}
}

export {};
