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
