import { Race } from '@/app/types.d'
import RaceSummary from '@/app/races/RaceSummary'
import { Suspense } from 'react'
import { getFullURL } from '../utils'
import Link from 'next/link'
import Loading from '../loading'

const getRaces = async (): Promise<Race[]> => {
  
  return fetch (getFullURL ("/api/races")).then (res => res.json())
}


export default async function Races() {

  const races = await getRaces ()

  return (
    <Suspense fallback={<Loading />}>
      <section className='max-w-4xl mx-auto flex flex-col gap-5'>
        {
          races!.map ((race: Race) => {
            if (race.hasTimes) {
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
    </Suspense>
  )
}
