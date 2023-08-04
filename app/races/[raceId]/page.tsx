import RaceSummary from '@/app/races/RaceSummary'
import TimesTable from '@/app/races/[raceId]/TimesTable'
import { Race } from '@/app/types'
import { getFullURL } from '@/app/utils'
import Loading from '@/app/loading'
import { Suspense } from 'react'
import ScrollToTop from './ScrollToTop'

const getRace = async ({raceId}: {raceId: string}): Promise<Race> => {
  
  return fetch (getFullURL (`/api/races/${raceId}`)).then (res => res.json())
}

export default async function Race({params}: {params: {raceId: string}}) {

  const {raceId} = params
  const race = await getRace({raceId})

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <ScrollToTop />
        <section className='max-w-4xl mx-auto'>
          <RaceSummary race={race} hover={false} />
        </section>
        <section className='px-8'>
          <TimesTable times={race.times!}/>
        </section>
      </div>
    </Suspense>
  )
}
