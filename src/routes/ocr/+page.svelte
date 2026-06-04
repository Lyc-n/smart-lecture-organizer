<script lang="ts">
  import { runOcr } from './ocr.remote';

  let imgUrl = $state('');
  let extractedText = $state('');
  let error = $state('');
  let isLoading = $state(false);

  async function handleRunOcr() {
    error = '';
    extractedText = '';
    isLoading = true;

    try {
      const result = await runOcr({
        imgUrl,
      });

      extractedText = result.text;
    } catch (err) {
      console.error(err);
      error = err instanceof Error ? err.message : 'OCR failed';
    } finally {
      isLoading = false;
    }
  }
</script>

<form
  onsubmit={(event) => {
    event.preventDefault();
    void handleRunOcr();
  }}
>
  <label>
    Image URL

    <input
      type="url"
      bind:value={imgUrl}
      placeholder="https://example.com/image.jpg"
      required
    />
  </label>

  <button type="submit" disabled={isLoading || !imgUrl}>
    {isLoading ? 'Running OCR...' : 'Run OCR'}
  </button>
</form>

{#if error}
  <p style="color: red;">{error}</p>
{/if}

{#if extractedText}
  <h2>Extracted text</h2>
  <pre>{extractedText}</pre>
{/if}