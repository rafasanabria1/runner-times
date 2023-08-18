'use client'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchRaceForm ({ searchValue = '' }) {
  const router = useRouter()
  const [search, setSearch] = useState(searchValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search !== '') router.push('/races?q=' + encodeURI(search))
    else router.push('/races')
  }

  return (

    <form onSubmit={handleSubmit}>
      <label htmlFor="search" className="sr-only">Busca por ciudad o nombre de carrera...</label>
      <div className="relative">
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 hover:cursor-pointer'>
          <button type='submit'>
            <IconSearch className='text-white'/>
          </button>
        </div>
        <input type="text" id="search" name="search" className="block rounded-lg w-full input input-bordered text-white input-md desktop:input-lg !pl-12" placeholder="Busca por ciudad o nombre de carrera..." value={search} onChange={(e) => { setSearch(e.target.value) }} />
        <div className={`absolute inset-y-0 right-0 flex items-center pr-3 ${search !== '' ? 'hover:cursor-pointer' : 'hidden'}`} onClick={() => { setSearch(''); router.push('/races') }}>
          <IconX className='text-white'/>
        </div>
      </div>
    </form>
  )
}
