import SearchRaceForm from '@/app/components/SearchRaceForm'
import RaceSummary from './RaceSummary'
import { getAll } from '@/app/models/RaceModel'
import { type Race } from '@/app/lib/types'

export default async function Races ({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const search = searchParams?.q ?? ''
  const races = await getAll({ search })

  return (
    <>
      <section>
        <SearchRaceForm searchValue={search} />
      </section>

      <section className='overflow-y-auto'>
        {
          (races != null) && races.length <= 0 && (
            <span className='block text-lg text-center py-10 h-full'>No se han encontrado carreras para esa búsqueda.</span>
          )
        }
        {
          (races != null) && races.length > 0 && (
            <article className='grid desktop:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(600px,1fr))] gap-5 overflow-y-auto'>
              {
                races.map((race: Race) => <RaceSummary race={race} key={race.id} />)
              }
            </article>
          )
        }
      </section>
    </>
  )
}
