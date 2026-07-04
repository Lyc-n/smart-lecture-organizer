import { createRouteHandler } from 'uploadthing/server';
import { fileRouter } from '$lib/server/uploadthing';
import type { RequestHandler } from './$types';

const handler = createRouteHandler({ router: fileRouter });

export const GET: RequestHandler = (event) => handler(event.request);
export const POST: RequestHandler = (event) => handler(event.request);
