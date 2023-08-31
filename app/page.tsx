import SearchRaceForm from '@/app/components/SearchRaceForm'
import Link from 'next/link'
import SearchRaceFocus from './components/SearchRaceFocus'

export default async function Home () {
  return (
    <>
      <section>
        <SearchRaceForm />
      </section>
      <section className='grid place-items-center h-full overflow-y-auto'>
        <div className="flex flex-col w-full desktop:w-1/2 mx-auto">
          <SearchRaceFocus />
          <div className="divider">O</div>
          <Link href="/races" className="grid h-24 lg:h-32 card bg-base-200 rounded-box place-items-center uppercase font-bold hover:cursor-pointer">Consulta todas</Link>
        </div>
      </section>
    </>
  )
}
