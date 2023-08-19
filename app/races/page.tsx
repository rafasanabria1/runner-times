import { type Race } from '@/lib/types'
import SearchRaceForm from '@/components/SearchRaceForm'
import RaceSummary from './RaceSummary'
import { getFullURL } from '@/lib/utils'

const fetchRaces = async (searchValue = ''): Promise<Race[]> => {
  const response = await fetch(getFullURL(`/api/races?q=${encodeURI(searchValue)}`))
  if (!response.ok) return await Promise.resolve([])
  return await response.json()
}

export default async function Races ({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const searchValue = searchParams?.q ?? ''
  const races = await fetchRaces(searchValue)

  return (
    <>
      <section>
        <SearchRaceForm searchValue={searchValue} />
      </section>

      <section>
        {
          (races != null) && races.length <= 0 && (
            <span className='block text-lg text-center py-10 h-full'>No se han encontrado carreras para esa búsqueda.</span>
          )
        }
        {
          (races != null) && races.length > 0 && (
            <article className='grid desktop:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(600px,1fr))] gap-5 overflow-y-auto'>
              {
                races?.map((race: Race) => <RaceSummary race={race} key={race.id} />)
              }
            </article>
          )
        }
      </section>
    </>
  )
}
