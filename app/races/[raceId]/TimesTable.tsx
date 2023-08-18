'use client'
import { type Time } from '@/lib/types'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce, usePagination } from '@/lib/hooks'
import { NOCLUB } from '@/lib/const'
import Paginator from '@/components/Paginator'
import { IconX } from '@tabler/icons-react'

export default function TimesTable ({ times }: { times: Time[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [club, setClub] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const debouncedSearch = useDebounce(search, 300).toUpperCase()

  const { categories, clubs } = useMemo(() => {
    const categoriesMap = new Map<Time['category'], number>()
    const clubsMap = new Map<Time['club'], number>()
    let countNoClub = 0
    times.forEach(time => {
      const categoryCount = categoriesMap.get(time.category) ?? 0
      categoriesMap.set(time.category, categoryCount + 1)

      if (time.club === '') return countNoClub++

      const clubCount = clubsMap.get(time.club) ?? 0
      clubsMap.set(time.club, clubCount + 1)
    })

    const categories = Array.from(categoriesMap.entries()).map(([category, count]) => ({ category, count })).sort((a, b) => (a.category > b.category) ? 1 : -1)
    const clubs = Array.from(clubsMap.entries()).map(([club, count]) => ({ club, count })).sort((a, b) => (a.club > b.club) ? 1 : -1)
    clubs.unshift({ club: NOCLUB, count: countNoClub })

    return {
      categories,
      clubs
    }
  }, [times])

  const timesFiltered = useMemo(() => {
    if (debouncedSearch === '' && category === '' && club === '') return times
    return times.filter(time => {
      let show = true
      if (debouncedSearch !== '') show = show && (time.name.includes(debouncedSearch) || time.surname.includes(debouncedSearch))
      if (category !== '') show = show && (time.category === category)
      if (club !== '') {
        if (club === NOCLUB) show = show && (time.club === '')
        else show = show && (time.club === club)
      }
      return show
    })
  }, [times, debouncedSearch, category, club])

  const { paginationRange, firstIndexToShow, lastIndexToShow } = usePagination({ currentPage, pageSize, totalCount: timesFiltered.length })

  const timesToShow = timesFiltered.slice(firstIndexToShow, lastIndexToShow)

  const removeFilters = () => {
    if (category !== '' || club !== '' || search !== '') {
      setCategory('')
      setClub('')
      setSearch('')
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [category, club, pageSize])

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
                  categories.map(({ category, count }) => {
                    return (
                      <option value={category} key={category}>{category} ({count})</option>
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
                  clubs.map(({ club, count }) => {
                    return (
                      <option value={club} key={club}>{club} ({count})</option>
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
              timesToShow.length <= 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-4">Sin resultados</td>
                </tr>
              )
            }
            {
              timesToShow.map(time => {
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
          resultsFilteredCount={timesFiltered.length}
          resultsCount={times.length}
          paginationRange={paginationRange}
          firstIndexToShow={firstIndexToShow}
          lastIndexToShow={lastIndexToShow}
          setCurrentPage={setCurrentPage}
      />
    </>
  )
}
