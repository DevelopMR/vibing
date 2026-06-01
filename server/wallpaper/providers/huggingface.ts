import { InferenceClient } from '@huggingface/inference'

const MODEL = 'black-forest-labs/FLUX.1-schnell'
const RETRY_DELAYS_MS = [12000, 20000, 30000]

export async function generateImage(
  prompt: string,
  token: string,
  seed?: number,
): Promise<Buffer> {
  const client = new InferenceClient(token)
  let lastError: Error = new Error('HuggingFace generation failed')

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const blob = await client.textToImage({
        model: MODEL,
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,
          guidance_scale: 0,
          width: 1280,
          height: 720,
          ...(seed !== undefined ? { seed } : {}),
        },
      })
      return Buffer.from(await blob.arrayBuffer())
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      const status = (err as { status?: number })?.status ?? 0

      if (status === 503 || status === 429) {
        const delay = RETRY_DELAYS_MS[attempt] ?? 30000
        console.log(`[wallpaper] HF ${status}, retrying in ${delay / 1000}s…`)
        await sleep(delay)
        continue
      }

      throw lastError
    }
  }

  throw lastError
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
