import { type Race } from '@/app/types.d'
import Image from 'next/image'
import cartelImg from '@/app/images/cartel.jpg'
import Link from 'next/link'

export default function RaceSummary ({ race }: { race: Race }) {
  if (race.id === undefined) return null

  let dateFormatted = ''
  if (race.date !== undefined) {
    dateFormatted = (new Date(race.date)).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <article className='p-3 desktop:p-5 rounded-lg bg-base-200 grid items-center'>
      <div className="flex gap-2 desktop:gap-5 flex-col desktop:flex-row justify-center desktop:items-center">
        <div className="h-40 w-32 rounded-lg border-2 border-dark mx-auto" >
          <Link href={`/races/${race.id}`} >
            <Image src={cartelImg} alt={race.name} className='object-fill w-full h-full' />
          </Link>
        </div>
        <div className='grow w-full'>
          <Link href={`/races/${race.id}`}>
            <h3 className="text-xl font-bold text-center desktop:text-left desktop:text-3xl">{race.name}</h3>
          </Link>
          <div className='flex flex-col text-sm items-center mt-2 desktop:items-start desktop:text-lg'>
            <span>{ race.city } - { dateFormatted }</span>
            <span>{ race.distance } metros</span>
            {
              race.timesCount > 0
                ? <span>{ race.timesCount } tiempos registrados</span>
                : <span>&middot; Tiempos no disponibles</span>
            }
          </div>
        </div>
      </div>
    </article>
  )
}
