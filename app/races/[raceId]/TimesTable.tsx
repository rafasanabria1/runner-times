'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Time } from "@/app/types"
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useMemo, useState } from "react"
import { useDebounce, usePagination } from "@/app/hooks"
import { NOCLUB } from "@/app/const"
import Paginator from "@/components/Paginator"

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
  
  const timesToShow = timesFiltered.slice (firstIndexToShow, lastIndexToShow)

  const removeFilters = () => {
    
    if (category || club || search) {
      setCategory ('')
      setClub ('')
      setSearch ('')
    }
  }

  useEffect (() => {
    setCurrentPage (1)
  }, [category, club, pageSize])
    
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
          <div>
            <button className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg py-2 px-3' onClick={removeFilters}>
              <FontAwesomeIcon icon={faClose} />
            </button>
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
        
      </section>
    </>
  )
}