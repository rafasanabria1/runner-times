import TimesTable from '@/app/races/[raceId]/TimesTable'
import { type Race as RaceType } from '@/lib/types'
import { getFullURL } from '@/app/utils'

const getRace = async ({ raceId }: { raceId: string }): Promise<RaceType> => {
  return await fetch(getFullURL(`/api/races/${raceId}`)).then(async res => await res.json())
}

export default async function Race ({ params }: { params: { raceId: string } }) {
  const { raceId } = params
  const race = await getRace({ raceId })

  return (race.timesCount > 0 && race.times !== undefined) ? <TimesTable times={race.times}/> : <span>Hola</span>
}
