import { command } from '$app/server';
import { recognizeImageFromUrl } from '$lib/server/ocr';

export const runOcr = command('unchecked', async ({ imgUrl }) => {
  const result = await recognizeImageFromUrl(imgUrl);

  return {
    text: result.text,
  };
});