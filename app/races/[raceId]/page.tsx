import TimesResults from '@/app/races/[raceId]/TimesResults'
import { getRaceCategoriesWithCount, getRaceClubsWithCount, getRaceFromId } from '@/app/models/RaceModel'
import { getAllFromFilters } from '@/app/models/TimeModel'

export default async function Race ({ params, searchParams }: { params: { raceId: string }, searchParams: Record<string, string | undefined> }) {
  const { raceId } = params
  const search = searchParams?.q !== undefined ? decodeURI(searchParams.q) : ''
  const category = searchParams?.category !== undefined ? decodeURI(searchParams.category) : ''
  const club = searchParams?.club !== undefined ? decodeURI(searchParams.club) : ''
  const page = Number(searchParams?.page ?? '1')
  const perPage = Number(searchParams?.per_page ?? '25')

  const race = await getRaceFromId(raceId)
  const categories = await getRaceCategoriesWithCount(raceId)
  const clubs = await getRaceClubsWithCount(raceId)
  const [times, countAll, countFiltered] = await getAllFromFilters({ raceId, search, category, club, page, perPage })

  if (race === undefined || race === null) return <span>Carrera no encontrada</span>

  return <TimesResults
    race={race}
    categories={categories}
    clubs={clubs}
    times={times}
    timesCountAll={countAll}
    timesCountFiltered={countFiltered}
    searchValue={search}
    categoryValue={category}
    clubValue={club}
    pageValue={page}
    perPageValue={perPage}
    />
}
