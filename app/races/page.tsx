import Link from 'next/link'
import { Race } from '@/app/types'

async function getRaces() {
  
  const res = await fetch('http://localhost:3000/api/races')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}


export default async function Races() {

  const racesRaw = await getRaces ()
  const races = racesRaw.map (race => {
    const date = new Date (race.date)
    return {...race, dateFormatted: date.toLocaleDateString()}
  })


  const filterBy = ({field, value}: {field: string, value: string}) => {

    console.log ({field, value})
  }
  
  
  return (
    <main className="place-content-center min-h-full h-full flex-grow ">
      <main className='max-w-4xl mx-auto px-4'>
        <div className="races-container flex flex-col gap-5 py-5">
          {
            races.map ((race: Race) => {
              return (
                <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8" key={race.id}>
                  <div className="flex items-start sm:gap-8">
                    <div
                      className="hidden sm:grid sm:h-20 sm:w-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-indigo-500"
                      aria-hidden="true"
                    >
                      Cartel
                    </div>

                    <div>
                      <strong
                        className="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                      >
                        {race.dateFormatted}
                      </strong>

                      <h3 className="mt-4 text-lg font-medium sm:text-xl">
                        {
                          race.hasTimes ? 
                            <Link href={`http://localhost:3000/races/${race.id}`} className="hover:underline">{race.name}</Link>
                            :
                            race.name
                        }
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">
                        {race.city}
                      </p>

                      <div className="mt-4 text-gray-500 sm:flex sm:items-center sm:gap-2 text-xs font-medium">
                        <p>Distancia: {race.distance} metros</p>
                        <span className="hidden sm:block" aria-hidden="true">&middot;</span>
                        <p className="mt-2 sm:mt-0">
                          {
                              race.hasTimes ? 
                                <Link href={`http://localhost:3000/races/${race.id}`} className='underline hover:text-gray-800'>Consultar tiempos</Link> 
                                : 
                                <span className='text-red-400'>Tiempos no disponibles</span>
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })
          }          
        </div>
      </main>
    </main>
  )
}
