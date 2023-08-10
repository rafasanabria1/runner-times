'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Time } from "../../types"
import { faAngleLeft, faAngleRight, faClose, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useMemo, useState } from "react"
import { useDebounce, usePagination } from "@/app/hooks"
import { DOTS, NOCLUB } from "@/app/const"

export default function TimesTable ({times}: {times: Time[] }) {

  const [search, setSearch] = useState ('')
  const [category, setCategory] = useState ('')
  const [club, setClub] = useState ('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState (25)
  const debouncedSearch = useDebounce (search, 300).toUpperCase()

  const {categories, clubs} = useMemo (() => {
    
    const categoriesMap = new Map<Time["category"], number> ();
    const clubsMap = new Map<Time["club"], number> ();
    let countNoClub = 0
    times.map (time => {
      if (categoriesMap.has (time.category)) categoriesMap.set (time.category, categoriesMap.get (time.category)! + 1)
      else categoriesMap.set (time.category, 1)

      if (! time.club) return countNoClub++
      
      if (clubsMap.has (time.club)) clubsMap.set (time.club, clubsMap.get (time.club)! + 1)
      else clubsMap.set (time.club, 1)
    })

    const categories = Array.from(categoriesMap.entries()).map(([category, count]) => ({category, count})).sort ((a, b) => (a.category > b.category) ? 1 : -1)
    const clubs = Array.from(clubsMap.entries()).map(([club, count]) => ({club, count})).sort ((a, b) => (a.club > b.club) ? 1 : -1)
    clubs.unshift ({club: NOCLUB, count: countNoClub})
    
    return {
      categories,
      clubs
    }
  }, [times])

  const timesFiltered = useMemo (() => {
    
    if (! debouncedSearch && !category && !club) return times
    return times.filter (time => {
      
      let show = true
      if (debouncedSearch) show = show && (time.name.indexOf (debouncedSearch) > -1) || (time.surname.indexOf (debouncedSearch) > -1)
      if (category) show = show && (time.category === category)
      if (club) {
        if (club === NOCLUB) show = show && (!time.club)
        else show = show && (time.club === club)
      }
      return show
  })
}, [times, debouncedSearch, category, club])

  const { paginationRange, firstIndexToShow, lastIndexToShow} = usePagination({currentPage, pageSize, totalCount: timesFiltered.length})
  
  const lastPage = Math.ceil(timesFiltered.length / pageSize)
  const timesToShow = timesFiltered.slice (firstIndexToShow, lastIndexToShow)

    
  return (
    <>
      <section className='filters-container py-5 flex justify-between'>
        <div className="flex gap-5">
          <div className="flex gap-2 items-center">
            <label htmlFor="results">Mostrando:</label>
            <select id="categories" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 w-80 " value={pageSize} onChange={e => setPageSize(parseInt(e.target.value))}>
              <option value="25">25 participantes</option>
              <option value="50">50 participantes</option>
              <option value="100">100 participantes</option>
            </select>
          </div>
        </div>
        <div className="flex gap-5">
          <div>
            <label htmlFor="categories" className="sr-only">Selecciona una categoría</label>
              <select id="categories" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 w-80 " value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Filtrar por categoría</option>
                {
                  categories.map (({category, count}) => {
                    return (
                      <option value={category} key={category}>{category} ({count})</option>
                      )
                    })
                  }
            </select>
          </div>
          <div>
            <label htmlFor="clubs" className="sr-only">Selecciona un club</label>
              <select id="clubs" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 w-80 " value={club} onChange={e => setClub(e.target.value)}>
                <option value="">Filtrar por club</option>
                {
                  clubs.map (({club, count}) => {
                    console.log ({club, count})
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
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="text" id="search" name="search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50" placeholder="Busca tu nombre" value={search} onChange={(e) => setSearch(e.target.value)} />
                </form>
                <div className={`absolute inset-y-0 right-0 flex items-center pr-3 ${search !== '' ? 'hover:cursor-pointer' : 'hidden'}`} onClick={() => setSearch('')}>
                  <FontAwesomeIcon icon={faClose} />
                </div>
            </div>
          </div>
        </div>
      </section>
      <section className='times-container'>
        <table className="w-full text-sm text-left ">
          <thead className="text-xs text-white uppercase bg-light ">
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
              timesToShow.length <= 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-4">Sin resultados</td>
                </tr>
              )
            }
            {
              timesToShow.map (time => {
                return (
                    <tr className="bg-white py-2 border-b hover:bg-dark hover:text-white hover:py-4 hover:text-lg ease-in duration-150 " key={time.id}>
                    <td className='text-center py-0.5'>{time.generalClasif}</td>
                    <td className='text-center py-0.5'>{time.categoryClasif}</td>
                    <td className='text-center py-0.5'>{time.sexClasif}</td>
                    <td className='text-center py-0.5'>{time.name + ' ' + time.surname}</td>
                    <td className='text-center py-0.5'>{time.category}</td>
                    <td className='text-center py-0.5'>{time.sex}</td>
                    <td className='text-center py-0.5'>{time.totalTime}</td>
                    <td className='text-center py-0.5'>{time.mKm}</td>
                    <td className='text-center py-0.5'>{time.diffTimeToFirst}</td>
                    <td className='text-center py-0.5'>{time.club}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <section className="flex items-center justify-between py-5">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
            <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {
                  timesFiltered.length <= pageSize ? `Mostrando ${timesFiltered.length} resultados filtrados (${times.length} totales).` : `Mostrando del ${firstIndexToShow + 1} al ${lastIndexToShow} de ${timesFiltered.length} resultados filtrados (${times.length} totales).`
                }
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                {
                  currentPage > 1 && (
                    <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" onClick={() => setCurrentPage(currentPage - 1)}>
                      <span className="sr-only">Anterior</span>
                      <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                  )
                }
                {
                  paginationRange.map (pageNumber => {
                
                    if (pageNumber === DOTS) {
                      return <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0" key={DOTS}>...</span>
                    } else if (pageNumber === currentPage) {
                      return <span aria-current="page" className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" key={`page-${pageNumber}`}>{pageNumber}</span>
                    } else {
                      return <button onClick={() => setCurrentPage (pageNumber)} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" key={`page${pageNumber}`}>{pageNumber}</button>
                    }
                  })
                }
                {
                  currentPage < lastPage && (
                    <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" onClick={() => setCurrentPage(currentPage + 1)}>
                      <span className="sr-only">Siguiente</span>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  )
                }
              </nav>
            </div>
          </div>
        </section>
      </section>
    </>
  )
}