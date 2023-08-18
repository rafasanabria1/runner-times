'use client'
import { type Race } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import SearchRaceForm from '@/components/SearchRaceForm'
import RaceSummary from './RaceSummary'
import useSWR from 'swr'
import Loading from '../loading'

const fetchRaces = async (url: string): Promise<Race[]> => {
  const response = await fetch(url)
  if (!response.ok) return await Promise.resolve([])
  return await response.json()
}

export default function Races () {
  const search = useSearchParams()
  const searchValue = search.get('q') ?? ''
  const { data: races, isLoading } = useSWR(`/api/races?q=${searchValue}`, fetchRaces)

  if (isLoading) return <Loading />

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
