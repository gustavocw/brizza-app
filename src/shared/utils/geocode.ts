// Address → coordinates via Nominatim/OpenStreetMap (free, no key). TEMPORARY
// source for the maps: until the third-party fleet API provides the real vehicle
// GPS, the maps center on the user's registered address. Never throws — null
// means "couldn't geocode". BrasilAPI was tried first but rarely carries CEP
// coordinates, so we geocode the full street address instead (more precise).

export type GeoPoint = { latitude: number; longitude: number }

export type GeocodeAddress = { street?: string; number?: string; city?: string; state?: string }

export async function geocodeAddress(addr: GeocodeAddress): Promise<GeoPoint | null> {
  const q = [addr.street, addr.number, addr.city, addr.state].filter(Boolean).join(', ')
  if (!q) return null
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(q)}`
    const res = await fetch(url, { headers: { 'User-Agent': 'brizze-mobile/1.0' } })
    if (!res.ok) return null
    const hits = (await res.json()) as { lat?: string; lon?: string }[]
    const latitude = Number(hits[0]?.lat)
    const longitude = Number(hits[0]?.lon)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
    return { latitude, longitude }
  } catch {
    return null
  }
}
