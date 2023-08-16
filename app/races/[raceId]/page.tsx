import RaceSummary from '@/app/races/RaceSummary'
import TimesTable from '@/app/races/[raceId]/TimesTable'
import { type Race as RaceType } from '@/app/types'
import { getFullURL } from '@/app/utils'
import ScrollToTop from '@/components/ScrollToTop'

const getRace = async ({ raceId }: { raceId: string }): Promise<RaceType> => {
  return await fetch(getFullURL(`/api/races/${raceId}`)).then(async res => await res.json())
}

export default async function Race ({ params }: { params: { raceId: string } }) {
  const { raceId } = params
  const race = await getRace({ raceId })

  return (
    <div>
      <ScrollToTop />
      <section className='max-w-4xl mx-auto'>
        <RaceSummary race={race} />
      </section>
      <section className='px-8'>
        {
          (race.times != null) && (
            <TimesTable times={race.times}/>

          )
        }
      </section>
    </div>
  )
}
