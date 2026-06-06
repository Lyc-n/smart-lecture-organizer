import { env } from '$env/dynamic/private';
import { fileRouter } from '$lib/server/uploadthing';

import { createRouteHandler } from 'uploadthing/server';

const handlers = createRouteHandler({
	router: fileRouter,
	config: {
		token: env.UPLOADTHING_TOKEN
	}
});

export { handlers as GET, handlers as POST };
