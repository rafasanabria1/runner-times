import ScrollToTop from '@/app/components/ScrollToTop'
import RaceSummary from '@/app/components/RaceSummary'
import TimesTable from '@/app/races/[raceId]/TimesTable'
import { Race } from '@/app/types'
import { getFullURL } from '@/app/utils'
import Loading from '@/app/races/loading'
import { Suspense } from 'react'

const getRace = async ({raceId}: {raceId: string}): Promise<Race> => {
  
  return fetch (getFullURL (`/api/races/${raceId}`)).then (res => res.json())
}

export default async function Race({params}: {params: {raceId: string}}) {

  const {raceId} = params
  const race = await getRace({raceId})

  return (
    <Suspense fallback={<Loading />}>
      <main className="place-content-center min-h-full h-full flex-grow">
        <ScrollToTop />
        <section className='max-w-4xl mx-auto px-4 py-5'>
          <RaceSummary race={race} />
        </section>
        <section className='relative overflow-x-auto'>
          <div className="px-4 ">
            <TimesTable times={race.times!}/>
          </div>
        </section>
      </main>
    </Suspense>
  )
}
