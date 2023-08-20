import { type Race, type Time, type timesQueryParams } from '@/lib/types'

export class CustomError extends Error {
  code = 0

  constructor ({ message, code }: { message: string, code: number }) {
    super()
    this.message = message
    this.code = code
  }
}

export function generateFullURL ({ path, query }: { path: string, query?: { raceId?: string, link?: string, q?: string, category?: string, club?: string, page?: string, perPage?: string } }): string {
  const { raceId, link, q, category, club, page, perPage } = query ?? {}

  const url = new URL(path, process.env.BASE_URL ?? 'http://localhost:3000')
  if (raceId !== undefined && raceId !== '') url.searchParams.set('raceId', encodeURI(raceId))
  if (link !== undefined && link !== '') url.searchParams.set('link', encodeURI(link))
  if (q !== undefined && q !== '') url.searchParams.set('q', encodeURI(q))
  if (category !== undefined && category !== '') url.searchParams.set('category', encodeURI(category))
  if (club !== undefined && club !== '') url.searchParams.set('club', encodeURI(club))
  if (page !== undefined && page !== '') url.searchParams.set('page', page)
  if (perPage !== undefined && perPage !== '') url.searchParams.set('per_page', perPage)

  return url.toString()
}

export async function fetchRaces (searchValue = ''): Promise<Race[]> {
  const url = generateFullURL({ path: '/api/races', query: { q: searchValue } })
  const response = await fetch(url)
  if (!response.ok) return await Promise.resolve([])
  return await response.json()
}

export async function fetchRace ({ raceId, link }: { raceId?: string, link?: string }): Promise<Race | null> {
  if (raceId === undefined && link === undefined) return await Promise.resolve(null)

  let url
  if (raceId !== undefined) url = generateFullURL({ path: `/api/races/${raceId}` })
  else url = generateFullURL({ path: '/api/races', query: { link } })

  const response = await fetch(url)
  if (!response.ok) return await Promise.resolve(null)
  return await response.json()
}

export async function fetchTimes ({ raceId, q, category, club, page, perPage }: timesQueryParams): Promise<Time[]> {
  const url = generateFullURL({ path: `/api/races/${raceId}/times`, query: { q, category, club, page, perPage } })
  const response = await fetch(url)
  if (!response.ok) return await Promise.resolve([])
  return await response.json()
}
