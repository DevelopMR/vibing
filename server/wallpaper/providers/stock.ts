// Unsplash primary, Pexels fallback. Returns a public image URL (not downloaded).

export async function fetchStockImageUrl(
  keywords: string[],
  unsplashKey: string,
  pexelsKey: string,
): Promise<string> {
  const query = keywords.join(' ')

  if (unsplashKey) {
    try {
      return await fromUnsplash(query, unsplashKey)
    } catch (err) {
      console.warn('[wallpaper] Unsplash failed, trying Pexels:', err)
    }
  }

  if (pexelsKey) {
    return await fromPexels(query, pexelsKey)
  }

  throw new Error('No stock API keys configured')
}

async function fromUnsplash(query: string, key: string): Promise<string> {
  const url = new URL('https://api.unsplash.com/photos/random')
  url.searchParams.set('query', query)
  url.searchParams.set('orientation', 'landscape')
  url.searchParams.set('content_filter', 'high')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${key}` },
  })

  if (!res.ok) throw new Error(`Unsplash ${res.status}`)

  const data = (await res.json()) as { urls: { regular: string } }
  return data.urls.regular
}

async function fromPexels(query: string, key: string): Promise<string> {
  const url = new URL('https://api.pexels.com/v1/search')
  url.searchParams.set('query', query)
  url.searchParams.set('orientation', 'landscape')
  url.searchParams.set('per_page', '1')
  url.searchParams.set('size', 'large')

  const res = await fetch(url.toString(), {
    headers: { Authorization: key },
  })

  if (!res.ok) throw new Error(`Pexels ${res.status}`)

  const data = (await res.json()) as {
    photos: Array<{ src: { large: string } }>
  }

  if (!data.photos.length) throw new Error('Pexels returned no results')
  return data.photos[0].src.large
}
