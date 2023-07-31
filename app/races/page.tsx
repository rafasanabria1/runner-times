'use client'
import { Race, Race as RaceType } from '@/app/types.d'
import RaceSummary from '../components/RaceSummary'
import useSWR from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function Races() {

  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const {data: races, error, isLoading} = useSWR<Race[]>('/api/races/', fetcher)
  
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
        !isLoading && races && (
          <main className="min-h-full h-full flex-grow">
            <div className='max-w-4xl mx-auto px-4'>
                <section className="races-container flex flex-col gap-5 py-5">
                  {
                    races!.map ((race: RaceType) => {
                      return (
                        <RaceSummary race={race} key={race.id} showLink={true}/>
                      )
                    })
                  }
                </section>
            </div>
          </main>
        )
      }
    </>   
  )
}
