import { Race as RaceType } from '@/app/types.d'
import RaceSummary from '../components/RaceSummary'

async function getRaces() {
  
  const res = await fetch('http://localhost:3000/api/races')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}


export default async function Races() {

  const racesRaw = await getRaces ()
  const races = racesRaw.map ((race : RaceType) => {
    const date = new Date (race.date)
    return {...race, dateFormatted: date.toLocaleDateString()}
  })

  return (
    <main className="place-content-center min-h-full h-full flex-grow ">
      <div className='max-w-4xl mx-auto px-4'>
        <section className="races-container flex flex-col gap-5 py-5">
          {
            races.map ((race: RaceType) => {
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
