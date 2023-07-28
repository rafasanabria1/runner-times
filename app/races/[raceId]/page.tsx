import { Race, Time } from '@/app/types.d'
import RaceSummary from '@/app/components/RaceSummary'
import ScrollToTop from '@/app/components/ScrollToTop'
import prisma from "@/libs/prismadb"
import FilterBar from '@/app/components/FilterBar'
import { ChangeEvent, useState } from 'react'

async function getRace({raceId}: {raceId: string}): Promise<Race | null> {
  
  const race = await prisma.race.findUnique({
    where: {
      id: raceId
    },
    include: {
      times: {
        orderBy: {
          generalClasif: 'asc'
        }
      }
    }
  })

  if (! race) return null

  const {id, name, link, date, city, distance, hasTimes, times} = race
  let dateFormatted = ''
  if (date) {
    dateFormatted = (new Date(date)).toLocaleDateString('es-ES', { 
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const fullTimes = times.map (time => {
    const { id, raceId, name, surname, sex, category, club, generalClasif, categoryClasif, sexClasif, totalTime, diffTimeToFirst, diffMettersToFirst, mKm} = time
    return {
      id,
      raceId,
      name, 
      surname: surname ?? '',
      fullname: surname ? `${name} ${surname}` : name,
      sex: sex ?? '',
      category: category ?? '',
      club: club ?? '',
      generalClasif: generalClasif ?? 0,
      categoryClasif: categoryClasif ?? 0,
      sexClasif: sexClasif ?? 0,
      totalTime: totalTime ?? '',
      diffTimeToFirst: diffTimeToFirst ?? '',
      diffMettersToFirst: diffMettersToFirst ?? '',
      mKm: mKm ?? ''
    }
  })
  const fullRace = {
    id,
    name,
    link,
    date,
    dateFormatted,
    city: city ?? '',
    distance: distance ?? 0,
    hasTimes,
    times: fullTimes
  }

  return fullRace
}


export default async function Race({params}: {params: {raceId: string}}) {

  const {raceId} = params
  const race = await getRace({raceId})
  
  return (
    <main className="place-content-center min-h-full h-full flex-grow">
      <ScrollToTop />
      <section className='max-w-4xl mx-auto px-4 py-5'>
        <RaceSummary race={race} showLink={false} />
      </section>
      <section className='relative overflow-x-auto shadow-md'>
        <div className="px-4 ">
          <FilterBar />
          <div className=''>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">Clasificación general</th>
                  <th scope="col" className="px-6 py-3 text-center">Clasificación categoría</th>
                  <th scope="col" className="px-6 py-3 text-center">Clasificación sexo</th>
                  <th scope="col" className="px-6 py-3 text-center">Competidor/a</th>
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
                  race?.times?.map ((time: Time) => {
                    return (
                      <tr className="bg-white border-b hover:bg-gray-50 " key={time.id}>
                        <td className='text-center'>{time.generalClasif}</td>
                        <td className='text-center'>{time.categoryClasif}</td>
                        <td className='text-center'>{time.sexClasif}</td>
                        <td className='text-center'>{time.fullname}</td>
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
          TF</div>
        </div>
      </section>
    </main>
  )
}
