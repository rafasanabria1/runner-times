import { type Race } from '@/app/types.d'
import { getFullURL } from '../utils'
import RaceList from './RaceList'

const getRaces = async (): Promise<Race[]> => {
  return await fetch(getFullURL('/api/races')).then(async res => await res.json())
}

export default async function Races () {
  const races = await getRaces()

  return <RaceList races={races} />
}
