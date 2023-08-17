'use client'
import { type Race } from '../types'
import { useMemo, useState } from 'react'
import RaceSummary from './RaceSummary'
import { useDebounce } from '../hooks'
import { IconX } from '@tabler/icons-react'

export default function RaceGrid ({ races }: { races: Race[] }) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300).toUpperCase()

  const racesFiltered = useMemo(() => {
    if (debouncedSearch === '') return races
    return races.filter(race => {
      return race.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || race.city.toLocaleLowerCase().includes(debouncedSearch.toLowerCase())
    })
  }, [races, debouncedSearch])

  return (
    <>
      <section className='mb-5'>
        <div>
          <label htmlFor="search" className="sr-only">Busca por ciudad o nombre de carrera...</label>
          <div className="relative">
              <form onSubmit={(e) => { e.preventDefault() }}>
                <input type="text" id="search" name="search" className="block rounded-lg w-full   input input-bordered text-white input-md desktop:input-lg" placeholder="Busca por ciudad o nombre de carrera..." value={search} onChange={(e) => { setSearch(e.target.value) }} />
              </form>
              <div className={`absolute inset-y-0 right-0 flex items-center pr-3 ${search !== '' ? 'hover:cursor-pointer' : 'hidden'}`} onClick={() => { setSearch('') }}>
                <IconX className='text-white'/>
              </div>
          </div>
        </div>
      </section>
        {
          racesFiltered.length <= 0 && (
            <span className='block text-lg text-center py-10 h-full'>No se han encontrado carreras para esa búsqueda.</span>
          )
        }
        {
          (racesFiltered.length > 0) && (
            <section className='grid desktop:grid-cols-[repeat(auto-fill,minmax(600px,1fr))] gap-5 overflow-y-auto'>
              {
                racesFiltered.map((race: Race) => <RaceSummary race={race} key={race.id} />)
              }
            </section>
          )
        }
    </>
  )
}
