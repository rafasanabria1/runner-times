import SearchIcon from '@/app/components/icons/SearchIcon'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FilterBar ({search, setSearch}: {search: string, setSearch: (arg0: string) => void}) {

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault ()
  }

  return (
    <div className="py-4 flex justify-end">
      <label htmlFor="search" className="sr-only">Buscar</label>
      <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon />
          </div>
          <form onSubmit={handleSubmitSearch}>
            <input type="text" id="search" name="search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50" placeholder="Busca tu nombre" value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
      </div>
    </div>
  )
}