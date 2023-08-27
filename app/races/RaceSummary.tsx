import { type Race } from '@/app/lib/types'
import Image from 'next/image'
import Link from 'next/link'

export default function RaceSummary ({ race }: { race: Race }) {
  if (race.id === undefined) return null

  return (
    <article className='p-3 desktop:p-5 rounded-lg bg-base-200 grid items-center'>
      <div className="flex gap-2 desktop:gap-5 flex-col desktop:flex-row justify-center desktop:items-center">
        <div className="h-44 sm:h-40 w-36 rounded-lg border border-white mx-auto border-opacity-20" >
          <Link href={`/races/${race.id}?page=1&per_page=25`} >
            {
              (race.imageURL?.toString() !== undefined) &&
                <Image src={race.imageURL?.toString()} alt={race.name} className='object-fill w-full h-full' width={144} height={160} />
            }
          </Link>
        </div>
        <div className='grow w-full'>
          <Link href={`/races/${race.id}?page=1&per_page=25`}>
            <h3 className="text-xl font-bold text-center desktop:text-left desktop:text-3xl">{race.name}</h3>
          </Link>
          <div className='flex flex-col text-sm items-center mt-2 desktop:items-start desktop:text-lg'>
            <span>{ race.city } - { race.date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) }</span>
            <span>{ race.distance } metros</span>
            {
              race._count?.times > 0
                ? <span>{ race._count?.times } tiempos registrados</span>
                : <span>&middot; Tiempos no disponibles</span>
            }
          </div>
        </div>
      </div>
    </article>
  )
}
