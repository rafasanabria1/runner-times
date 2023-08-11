'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type Race } from '../types'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { useMemo, useState } from 'react'
import { getFullURL } from '../utils'
import Link from 'next/link'
import RaceSummary from './RaceSummary'
import { useDebounce } from '../hooks'

export default function RaceList ({ races }: { races: Race[] }) {
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
                <input type="text" id="search" name="search" className="block py-2 px-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 w-full h-16" placeholder="Busca por ciudad o nombre de carrera..." value={search} onChange={(e) => { setSearch(e.target.value) }} />
              </form>
              <div className={`absolute inset-y-0 right-0 flex items-center pr-3 ${search !== '' ? 'hover:cursor-pointer' : 'hidden'}`} onClick={() => { setSearch('') }}>
                <FontAwesomeIcon icon={faClose} />
              </div>
          </div>
        </div>
      </section>
      <section className='flex flex-col gap-5'>
        {
          racesFiltered.length <= 0 && (
            <span className='text-lg text-center py-10'>No se han encontrado carreras para esa búsqueda.</span>
          )
        }
        {
          racesFiltered.map((race: Race) => {
            if (race.id !== undefined && race.hasTimes) {
              return (
                <Link href={getFullURL(`/races/${race.id}`)} key={race.id}>
                  <RaceSummary race={race} hover={true}/>
                </Link>
              )
            } else {
              return (
                <RaceSummary race={race} hover={false} key={race.id} />
              )
            }
          })
        }
      </section>
    </>
  )
}
