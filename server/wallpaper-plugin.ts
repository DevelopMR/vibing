import type { Plugin, ResolvedConfig } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnv } from 'vite'
import { getWallpaper, generateWallpaper, deleteWallpaper } from './wallpaper/index.js'
import type { WallpaperContext } from '../src/wallpaper/types.js'

interface Env {
  hfToken: string
  unsplashKey: string
  pexelsKey: string
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk: Buffer) => { raw += chunk.toString() })
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}) }
      catch { resolve({}) }
    })
    req.on('error', reject)
  })
}

function send(res: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body)
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(payload)
}

export function wallpaperPlugin(): Plugin {
  let env: Env = { hfToken: '', unsplashKey: '', pexelsKey: '' }
  let resolvedConfig: ResolvedConfig

  return {
    name: 'comfort-day:wallpaper-api',

    configResolved(config) {
      resolvedConfig = config
      const e = loadEnv(config.mode, config.root, '')
      env = {
        hfToken: e.HUGGINGFACE_API_TOKEN ?? '',
        unsplashKey: e.UNSPLASH_ACCESS_KEY ?? '',
        pexelsKey: e.PEXELS_API_KEY ?? '',
      }
      console.log('[wallpaper] HF token loaded:', env.hfToken ? `${env.hfToken.slice(0, 8)}…` : 'MISSING')
    },

    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/wallpaper')) return next()

        const method = req.method ?? 'GET'

        try {
          console.log(`[wallpaper] ${method} ${url} | hfToken: ${env.hfToken ? env.hfToken.slice(0, 8) + '…' : 'MISSING'}`)

          // POST /api/wallpaper/generate-set
          if (method === 'POST' && url === '/api/wallpaper/generate-set') {
            const body = (await readBody(req)) as {
              entries: Array<{ date: string; context: WallpaperContext }>
            }
            // Fire and forget — client doesn't wait for the whole set
            ;(async () => {
              for (const { date, context } of body.entries) {
                try {
                  const existing = await getWallpaper(date)
                  if (!existing) {
                    console.log(`[wallpaper] Generating set entry: ${date}`)
                    await generateWallpaper(context, env)
                  }
                } catch (err) {
                  console.error(`[wallpaper] Set generation failed for ${date}:`, err)
                }
              }
              console.log('[wallpaper] Set generation complete')
            })()
            return send(res, 202, { status: 'generating' })
          }

          // Routes with /:date
          const match = url.match(/^\/api\/wallpaper\/([^/]+)(\/generate)?$/)
          if (!match) return next()

          const date = match[1]
          const isGenerate = !!match[2]

          // POST /api/wallpaper/:date/generate
          if (method === 'POST' && isGenerate) {
            const body = (await readBody(req)) as { context: WallpaperContext }
            const record = await generateWallpaper(body.context, env)
            return send(res, 200, record)
          }

          // DELETE /api/wallpaper/:date
          if (method === 'DELETE' && !isGenerate) {
            await deleteWallpaper(date)
            return send(res, 200, { deleted: date })
          }

          // GET /api/wallpaper/:date
          if (method === 'GET' && !isGenerate) {
            const record = await getWallpaper(date)
            if (!record) return send(res, 404, { error: 'not found' })
            return send(res, 200, record)
          }

          next()
        } catch (err) {
          const cause = (err as { cause?: unknown })?.cause
          console.error('[wallpaper] API error:', err, cause ? `\nCause: ${cause}` : '')
          send(res, 500, { error: String(err), cause: String(cause ?? '') })
        }
      })

      if (!resolvedConfig?.isProduction) {
        console.log('[wallpaper] API routes active on /api/wallpaper/*')
      }
    },
  }
}
