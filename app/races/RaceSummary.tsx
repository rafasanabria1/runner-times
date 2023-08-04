import { Race } from "@/app/types.d"

export default function RaceSummary ({race, hover}: {race: Race, hover: boolean}) {

  if (! race) return null

  let dateFormatted = ''
  if (race.date) {
    dateFormatted = (new Date(race.date)).toLocaleDateString('es-ES', { 
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }
  
  return (
    <article className={`rounded-xl p-8 ring ${ hover ? 'ring-light' : 'ring-darker' } ${ (hover && race.hasTimes) ? 'hover:ring-darker' : ''}`}>
      <div className="flex items-start sm:gap-8">
        <div className="hidden sm:grid sm:h-40 sm:w-32 sm:shrink-0 sm:place-content-center sm:rounded-lg sm:border-2 sm:border-dark" aria-hidden="true" ></div>

        <div className='flex-grow'>
          <div className='flex w-full justify-between items-center'>
            <h3 className="text-3xl">{race.name}</h3>
            <strong className="rounded bg-dark px-3 py-1.5 text-[10px] text-white">{ dateFormatted }</strong>
          </div>
          <p className="text-lg italic">{ race.city }</p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span>Distancia: { race.distance } metros</span>
            {
              ! race.hasTimes && (
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