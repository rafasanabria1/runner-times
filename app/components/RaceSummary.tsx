import Link from "next/link"
import { Race } from "@/app/types.d"

export default function RaceSummary (props: {race: Race | null, showLink: Boolean}) {

  const {race, showLink} = props
  if (! race) return null
  
  return (
    <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
      <div className="flex items-start sm:gap-8">
        <div
          className="hidden sm:grid sm:h-20 sm:w-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-indigo-500"
          aria-hidden="true"
        >
          Cartel
        </div>

        <div className='flex-grow'>
          <div className='flex  w-full justify-between items-center'>
            <h3 className="text-lg font-medium sm:text-xl">
              {
                race.hasTimes && showLink ? 
                  <Link href={`/races/${race.id}`} className="hover:underline">{race.name}</Link>
                  :
                  race.name
              }
            </h3>
            <strong
              className="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
            >
              { race.dateFormatted }
            </strong>

          </div>

          <p className="mt-1 text-sm text-gray-700">
            {race.city}
          </p>

          <div className="mt-4 text-gray-500 sm:flex sm:items-center sm:gap-2 text-xs font-medium">
            <p>Distancia: {race.distance} metros</p>
            <span className="hidden sm:block" aria-hidden="true">&middot;</span>
            <p className="mt-2 sm:mt-0">
              {
                  race.hasTimes && showLink ? 
                    <Link href={`/races/${race.id}`} className='underline hover:text-gray-800'>Consultar tiempos</Link> 
                    : 
                    <span className='text-red-400'>Tiempos no disponibles</span>
              }
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}