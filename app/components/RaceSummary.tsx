import { type Race } from '@/app/lib/types'
import Link from 'next/link'
import RaceImage from './RaceImage'

export default function RaceSummary ({ race }: { race: Race }) {
  if (race.id === undefined) return null

  return (
    <Link href={`/races/${race.id}?page=1&per_page=25`} >
      <article className='p-3 desktop:p-5 rounded-lg bg-base-200 grid items-center h-full'>
        <div className="flex gap-2 desktop:gap-5 flex-col desktop:flex-row justify-center desktop:items-center">
          <RaceImage url={race.imageURL ?? ''} alt={race.name} />
          <div className='grow w-full'>
            <h3 className="text-xl font-bold text-center desktop:text-left desktop:text-3xl">{race.name}</h3>
            <div className='flex flex-col text-sm items-center mt-2 desktop:items-start desktop:text-lg'>
              <span>{ race.city } - { race.date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) }</span>
              <span>{ race.distance } metros</span>
              {
                race._count?.times > 0
                  ? <span>{ race._count?.times } tiempos registrados</span>
                  : <span>Tiempos no disponibles</span>
              }
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
