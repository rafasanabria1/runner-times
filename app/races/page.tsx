import { type Race } from '@/app/types.d'
import { Suspense } from 'react'
import { getFullURL } from '../utils'
import Loading from '../loading'
import RaceList from './RaceList'

const getRaces = async (): Promise<Race[]> => {
  return await fetch(getFullURL('/api/races')).then(async res => await res.json())
}

export default async function Races () {
  const races = await getRaces()

  return (
    <Suspense fallback={<Loading />}>
      <div className='max-w-4xl mx-auto '>
        <RaceList races={races} />
      </div>
    </Suspense>
  )
}
