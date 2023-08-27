'use client'
import SearchRaceForm from '@/app/components/SearchRaceForm'
import Link from 'next/link'

export default function Home () {
  const handleSearch = () => {
    document.getElementById('search')?.focus()
  }
  return (
    <>
      <section>
        <SearchRaceForm />
      </section>
      <section className='grid place-items-center h-full'>
      <div className="flex flex-col w-full desktop:w-1/2 mx-auto">
        <div className="grid h-32 card bg-base-200 rounded-box place-items-center uppercase font-bold hover:cursor-pointer" onClick={handleSearch}>Busca tu carrera</div>
        <div className="divider">O</div>
        <Link href="/races" className="grid h-32 card bg-base-200 rounded-box place-items-center uppercase font-bold hover:cursor-pointer">Consulta todas</Link>
      </div>
      </section>
    </>
  )
}
