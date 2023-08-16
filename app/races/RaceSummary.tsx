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
    <article className='p-5 rounded-lg bg-base-200'>
      <div className="flex gap-5 ">
        <div className="h-40 w-32 rounded-lg border-2 border-dark overflow-hidden" >
          <Link href={`/races/${race.id}`} >
            <Image src={cartelImg} alt={race.name} className='object-fill w-full h-full' />
          </Link>
        </div>
        <div className='flex-1 pt-4'>
          <Link href={`/races/${race.id}`}>
            <h3 className="text-xl font-bold">{race.name}</h3>
          </Link>
          <p className="text-lg italic">{ race.city } - { dateFormatted }</p>
          <div className="flex items-center gap-2 text-sm">
            <span>Distancia: { race.distance } metros</span>
            {
              !race.hasTimes && (
                <>
                  <span className="block">&middot;</span>
                  <span className='text-darker'>Tiempos no disponibles</span>
                </>
              )
            }
          </div>
        </div>
      </div>
    </article>
  )
}
