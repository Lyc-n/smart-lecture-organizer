import type { fileRouter } from "$lib/server/uploadthing";

import { generateSvelteHelpers } from "@uploadthing/svelte";

export const { createUploader, createUploadThing } =
  generateSvelteHelpers<fileRouter>();
