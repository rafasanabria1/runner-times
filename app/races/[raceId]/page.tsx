'use client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import ScrollToTop from '@/app/components/ScrollToTop'
import RaceSummary from '@/app/components/RaceSummary'
import FilterBar from '@/app/components/FilterBar'
import TimesTable from '@/app/components/TimesTable'
import { Race, Time } from '@/app/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import useDebounce from '@/app/hooks/useDebounce'

export default function Race({params}: {params: {raceId: string}}) {

  const {raceId} = params

  const [times, setTimes] = useState<Time[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce (search, 300).toUpperCase()
  
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const {data: race, error, isLoading} = useSWR<Race>(`/api/races/${raceId}`, fetcher)

  useEffect (() => {
    if (! race || ! race.times) setTimes ([])
    else {
      const newTimes = debouncedSearch ? race.times.filter ((time: Time) => {
        return (time.name.indexOf (debouncedSearch) > -1) || (time.surname.indexOf (debouncedSearch) > -1) || (time.club?.indexOf (debouncedSearch) > -1)
      }) : race.times
      setTimes (newTimes)
    }
  }, [debouncedSearch, race])

  useEffect(() => {
    if (race && race.times) setTimes(race.times)
  }, [race])

  return (
    <>
      {
        isLoading && (
          <div className='flex-grow grid place-content-center'>
            <FontAwesomeIcon icon={faSpinner} spin className="w-12 h-12" />
          </div>
        )
      }
      {
        !isLoading && error && (
          <div className='flex-grow grid place-content-center'>
            <div className='text-red-700'>Error!!</div>
          </div>
        )
      }
      {
        !isLoading && race && (
          <main className="place-content-center min-h-full h-full flex-grow">
            <ScrollToTop />
            <section className='max-w-4xl mx-auto px-4 py-5'>
              <RaceSummary race={race!} showLink={false} />
            </section>
            <section className='relative overflow-x-auto'>
              <div className="px-4 ">
                <div className='filters-container'>
                  <FilterBar search={search} setSearch={setSearch} />
                </div>
                <div className='times-container'>
                  <TimesTable times={times} />
                </div>
              </div>
            </section>
          </main> 
        )
      }
    </>
  )
}
