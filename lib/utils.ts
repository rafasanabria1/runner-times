import { type Race, type Time, type timesQueryParams } from '@/lib/types'

export class CustomError extends Error {
  code = 0

  constructor ({ message, code }: { message: string, code: number }) {
    super()
    this.message = message
    this.code = code
  }
}

export function generateFullURL ({ path, query }: { path: string, query?: { raceId?: string, link?: string, q?: string, category?: string, club?: string, page?: string, perPage?: string, filters?: boolean } }): string {
  const { raceId, link, q, category, club, page, perPage, filters } = query ?? {}

  const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL !== undefined ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000'

  const url = new URL(path, baseURL)
  if (raceId !== undefined && raceId !== '') url.searchParams.set('raceId', encodeURI(raceId))
  if (link !== undefined && link !== '') url.searchParams.set('link', encodeURI(link))
  if (q !== undefined && q !== '') url.searchParams.set('q', encodeURI(q))
  if (category !== undefined && category !== '') url.searchParams.set('category', encodeURI(category))
  if (club !== undefined && club !== '') url.searchParams.set('club', encodeURI(club))
  if (page !== undefined && page !== '') url.searchParams.set('page', page)
  if (perPage !== undefined && perPage !== '') url.searchParams.set('per_page', perPage)
  if (filters !== undefined) url.searchParams.set('filters', filters.toString())

  return url.toString()
}

export async function fetchRaces (searchValue = ''): Promise<Race[]> {
  const url = generateFullURL({ path: '/api/races', query: { q: searchValue } })
  const response = await fetch(url)
  if (!response.ok) return await Promise.resolve([])
  return await response.json()
}

export async function fetchRace ({ raceId, link, filters = false }: { raceId?: string, link?: string, filters: boolean }): Promise<Race | null> {
  if (raceId === undefined && link === undefined) return await Promise.resolve(null)

  let url
  if (raceId !== undefined) url = generateFullURL({ path: `/api/races/${raceId}`, query: { filters } })
  else url = generateFullURL({ path: '/api/races', query: { link, filters } })

  const response = await fetch(url)
  if (!response.ok) return await Promise.resolve(null)
  return await response.json()
}

export async function fetchTimes ({ raceId, q, category, club, page, perPage }: timesQueryParams): Promise<{ times: Time[], countAll: number, countFiltered: number }> {
  const url = generateFullURL({ path: '/api/times', query: { raceId, q, category, club, page, perPage } })
  const response = await fetch(url)
  if (!response.ok) return await Promise.resolve({ times: [], countAll: 0, countFiltered: 0 })
  return await response.json()
}
