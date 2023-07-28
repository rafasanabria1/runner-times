import { Race, Race as RaceType } from '@/app/types.d'
import RaceSummary from '../components/RaceSummary'
import prisma from "@/libs/prismadb"

async function getRaces(): Promise<Race[]> {
  
  const races = await prisma?.race.findMany({
    include: {
      times: false
    },
    orderBy: {
      date: 'desc'
    }
  })

  const fullRaces = races?.map (race => {
    const {id, name, link, date, city, distance, hasTimes} = race
    let dateFormatted = ''
    if (date) {
      dateFormatted = (new Date(date)).toLocaleDateString('es-ES', { 
        month: "2-digit",
        day: "2-digit",
      })
    }
    return {
      id,
      name,
      link,
      date,
      dateFormatted,
      city: city ?? '',
      distance: distance ?? 0,
      hasTimes
    }
  })
 
  return fullRaces
}


export default async function Races() {

  const races = await getRaces ()
  
  return (
    <main className="place-content-center min-h-full h-full flex-grow ">
      <div className='max-w-4xl mx-auto px-4'>
        <section className="races-container flex flex-col gap-5 py-5">
          {
            races?.map ((race: RaceType) => {
              return (
                <RaceSummary race={race} key={race.id} showLink={true}/>
              )
            })
          }          
        </section>
      </div>
    </main>
  )
}
