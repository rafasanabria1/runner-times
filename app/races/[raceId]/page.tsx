import { Race as RaceType, Time } from '@/app/types'
import SearchIcon from '@/app/components/icons/SearchIcon'
import RaceSummary from '@/app/components/RaceSummary'
import ScrollToTop from '@/app/components/ScrollToTop'

async function getRace({raceId}: {raceId: string}): Promise<RaceType> {
  
  const res = await fetch(`http://localhost:3000/api/races/${raceId}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}


export default async function Race({params}: {params: {raceId: string}}) {

  const {raceId} = params
  const race = await getRace({raceId})
  
  return (
    <main className="place-content-center min-h-full h-full flex-grow">
      <ScrollToTop />
      <section className='max-w-4xl mx-auto px-4'>
        <RaceSummary race={race} showLink={false} />
      </section>
      <section className='relative overflow-x-auto shadow-md'>
        <div className="px-4 ">
          <div className="py-4 flex justify-end">
            <label htmlFor="table-search" className="sr-only">Buscar</label>
            <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon />
                </div>
                <input type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50" placeholder="Busca tu nombre" />
            </div>
          </div>
          <div className=''>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">Clasificación general</th>
                  <th scope="col" className="px-6 py-3 text-center">Clasificación categoría</th>
                  <th scope="col" className="px-6 py-3 text-center">Clasificación sexo</th>
                  <th scope="col" className="px-6 py-3 text-center">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-center">Apellidos</th>
                  <th scope="col" className="px-6 py-3 text-center">Categoría</th>
                  <th scope="col" className="px-6 py-3 text-center">Sexo</th>
                  <th scope="col" className="px-6 py-3 text-center">Tiempo</th>
                  <th scope="col" className="px-6 py-3 text-center">Ritmo (m/km)</th>
                  <th scope="col" className="px-6 py-3 text-center">Diferencia de tiempo con el 1º</th>
                  <th scope="col" className="px-6 py-3 text-center">Club</th>
                </tr>
              </thead>
              <tbody>
                {
                  race.times.map ((time: Time) => {
                    return (
                      <tr className="bg-white border-b hover:bg-gray-50 " key={time.id}>
                        <td className='text-center'>{time.generalClasif}</td>
                        <td className='text-center'>{time.categoryClasif}</td>
                        <td className='text-center'>{time.sexClasif}</td>
                        <td className='text-center'>{time.name}</td>
                        <td className='text-center'>{time.surname}</td>
                        <td className='text-center'>{time.category}</td>
                        <td className='text-center'>{time.sex}</td>
                        <td className='text-center'>{time.totalTime}</td>
                        <td className='text-center'>{time.mKm}</td>
                        <td className='text-center'>{time.diffTimeToFirst}</td>
                        <td className='text-center'>{time.club}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
