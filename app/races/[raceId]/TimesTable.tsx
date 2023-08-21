'use client'
import { type Race, type Time } from '@/lib/types'
import { useEffect, useState } from 'react'
import { usePagination } from '@/lib/hooks'
import { NOCLUB } from '@/lib/const'
import Paginator from '@/components/Paginator'
import { IconX } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { generateFullURL } from '@/lib/utils'

export default function TimesTable ({
  race,
  times,
  timesCountAll = 0,
  timesCountFiltered = 0,
  searchValue = '',
  categoryValue = '',
  clubValue = '',
  pageValue = 1,
  perPageValue = 25
}: {
  race: Race
  times: Time[]
  timesCountAll: number
  timesCountFiltered: number
  searchValue: string
  categoryValue: string
  clubValue: string
  pageValue: number
  perPageValue: number
}) {
  const router = useRouter()
  const [search, setSearch] = useState(searchValue)
  const [category, setCategory] = useState(categoryValue)
  const [club, setClub] = useState(clubValue)
  const [currentPage, setCurrentPage] = useState(pageValue)
  const [pageSize, setPageSize] = useState(perPageValue)

  const { categories, clubs } = race

  const { paginationRange, firstIndexToShow, lastIndexToShow } = usePagination({ currentPage, pageSize, totalCount: race.timesCountFiltered })

  const removeFilters = () => {
    setCategory('')
    setClub('')
    setSearch('')
  }

  useEffect(() => {
    if (category !== '' || club !== '' || search !== '') {
      setCurrentPage(1)
    }
  }, [category, club, search])

  useEffect(() => {
    if (race === null || race.id === undefined) return
    const url = generateFullURL({ path: `/races/${race.id}`, query: { q: search, category, club, page: currentPage.toString(), perPage: pageSize.toString() } })
    router.push(url)
  }, [router, race, search, category, club, currentPage, pageSize])

  return (
    <>
      <section className='filters-container flex justify-between w-full flex-col desktop:flex-row gap-5 '>
        <div>
          <div className="flex gap-2 items-center">
            <label htmlFor="results" className='text-xl'>Mostrando:</label>
            <select id="results" className="select select-bordered text-white select-sm w-full desktop:w-72 desktop:select-md" value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value)) }}>
              <option value="25">25 participantes</option>
              <option value="50">50 participantes</option>
              <option value="100">100 participantes</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col desktop:flex-row gap-5">
          <div>
            <label htmlFor="categories" className="sr-only">Selecciona una categoría</label>
              <select id="categories" className="select select-bordered text-white select-sm w-full desktop:w-72 desktop:select-md" value={category} onChange={e => { setCategory(e.target.value) }}>
                <option value="">Filtrar por categoría</option>
                {
                  categories?.map(({ name, count }) => {
                    return (
                      <option value={name} key={name}>{name} ({count})</option>
                    )
                  })
                  }
            </select>
          </div>
          <div>
            <label htmlFor="clubs" className="sr-only">Selecciona un club</label>
              <select id="clubs" className="select select-bordered text-white select-sm w-full desktop:w-72 desktop:select-md" value={club} onChange={e => { setClub(e.target.value) }}>
                <option value="">Filtrar por club</option>
                {
                  clubs?.map(({ name, count }) => {
                    const clubName = name === '' ? NOCLUB : name
                    return (
                      <option value={name} key={clubName}>{clubName} ({count})</option>
                    )
                  })
                  }
            </select>
          </div>
          <div>
            <label htmlFor="search" className="sr-only">Busca tu nombre</label>
            <div className="relative">
                <form onSubmit={(e) => { e.preventDefault() }}>
                  <input id="search" type="text" name="search" className="input input-bordered text-white input-sm w-full desktop:w-72 desktop:input-md" placeholder="Busca tu nombre" value={search} onChange={(e) => { setSearch(e.target.value) }} />
                </form>
                <div className={`absolute inset-y-0 right-0 flex items-center pr-3 ${search !== '' ? 'hover:cursor-pointer' : 'hidden'}`} onClick={() => { setSearch('') }}>
                  <IconX className='text-white'/>
                </div>
            </div>
          </div>
          <div className='hidden desktop:block'>
            <button className='btn btn-md bg-base-100 border-white border hover:bg-base-100 hover:border-white border-opacity-20' onClick={removeFilters}>
              <IconX className='text-white'/>
            </button>
          </div>
        </div>
      </section>
      <section className='times-container grow w-full overflow-y-auto'>
        <table className="table table-pin-rows">
          <thead className="text-white uppercase">
            <tr className='py-3 [&>th]:px-6 [&>th]:text-center'>
              <th scope="col">Clasificación general</th>
              <th scope="col">Competidor/a</th>
              <th scope="col">Categoría</th>
              <th scope="col">Sexo</th>
              <th scope="col">Tiempo</th>
              <th scope="col">Ritmo (m/km)</th>
              <th scope="col">Diferencia de tiempo con el 1º</th>
              <th scope="col">Club</th>
            </tr>
          </thead>
          <tbody>
            {
              timesCountFiltered <= 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-4">Sin resultados</td>
                </tr>
              )
            }
            {
              times.map(time => {
                return (
                    <tr className="py-2 hover [&>td]:py-2 [&>td]:text-center" key={time.id}>
                      <td>{time.generalClasif}</td>
                      <td>{time.name + ' ' + time.surname}</td>
                      <td>{time.category}</td>
                      <td>{time.sex}</td>
                      <td>{time.totalTime}</td>
                      <td>{time.mKm}</td>
                      <td>{time.diffTimeToFirst}</td>
                      <td>{time.club}</td>
                    </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
      <Paginator
          currentPage={currentPage}
          pageSize={pageSize}
          resultsFilteredCount={timesCountFiltered}
          resultsCount={timesCountAll}
          paginationRange={paginationRange}
          firstIndexToShow={firstIndexToShow}
          lastIndexToShow={lastIndexToShow}
          setCurrentPage={setCurrentPage}
      />
    </>
  )
}
