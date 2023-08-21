import TimesTable from '@/app/races/[raceId]/TimesTable'
import { fetchRace, fetchTimes } from '@/lib/utils'

export default async function Race ({ params, searchParams }: { params: { raceId: string }, searchParams: Record<string, string | undefined> }) {
  const { raceId } = params
  const q = searchParams?.q ?? ''
  const category = searchParams?.category ?? ''
  const club = searchParams?.club ?? ''
  const page = searchParams?.page ?? '1'
  const perPage = searchParams?.per_page ?? '25'

  const race = await fetchRace({ raceId, filters: true })
  const { times, countAll, countFiltered } = await fetchTimes({ raceId, q, category, club, page, perPage })

  if (race === undefined || race === null) return <span>Carrera no encontrada</span>

  return <TimesTable
    race={race}
    times={times}
    timesCountAll={countAll}
    timesCountFiltered={countFiltered}
    searchValue={q}
    categoryValue={category}
    clubValue={club}
    pageValue={parseInt(page)}
    perPageValue={parseInt(perPage)}
    />
}
