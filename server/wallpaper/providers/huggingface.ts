import { InferenceClient } from '@huggingface/inference'

const FLUX_MODEL = 'black-forest-labs/FLUX.1-schnell'
const SDXL_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'

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
        model: FLUX_MODEL,
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

// Converts a day image into a night version using img2img.
// Tries FLUX first (Option A), falls back to SDXL (Option B).
export async function generateNightFromDay(
  dayBuffer: Buffer,
  nightPrompt: string,
  token: string,
  seed?: number,
): Promise<Buffer> {
  const client = new InferenceClient(token)
  const dayBlob = new Blob([dayBuffer], { type: 'image/jpeg' })

  // Option A — FLUX img2img: same model, preserves composition best
  try {
    const blob = await client.imageToImage({
      model: FLUX_MODEL,
      inputs: dayBlob,
      parameters: {
        prompt: nightPrompt,
        strength: 0.45,
        num_inference_steps: 4,
        guidance_scale: 0,
        ...(seed !== undefined ? { seed } : {}),
      },
    })
    console.log('[wallpaper] Night generated via FLUX img2img')
    return Buffer.from(await blob.arrayBuffer())
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 0
    // Only fall through to SDXL for auth/capability failures, not transient errors
    if (status === 503 || status === 429) throw err
    console.warn(`[wallpaper] FLUX img2img unavailable (${status}), trying SDXL:`, err)
  }

  // Option B — SDXL img2img: reliable free-tier fallback
  const blob = await client.imageToImage({
    model: SDXL_MODEL,
    inputs: dayBlob,
    parameters: {
      prompt: nightPrompt,
      strength: 0.5,
      num_inference_steps: 25,
      guidance_scale: 7.5,
      width: 1280,
      height: 720,
      ...(seed !== undefined ? { seed } : {}),
    },
  })
  console.log('[wallpaper] Night generated via SDXL img2img')
  return Buffer.from(await blob.arrayBuffer())
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
