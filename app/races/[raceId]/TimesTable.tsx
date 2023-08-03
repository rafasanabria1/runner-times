'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Time } from "../../types"
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useMemo, useState } from "react"
import useDebounce from "@/app/hooks/useDebounce"

export default function TimesTable ({times}: {times: Time[] }) {

  const [search, setSearch] = useState ('')
  const [category, setCategory] = useState ('')
  const debouncedSearch = useDebounce (search, 300).toUpperCase()

  const categories = useMemo (() => {
    
    const categoriesMap = new Map<Time["category"], number> ();
    times.map (time => {
      if (categoriesMap.has (time.category)) categoriesMap.set (time.category, categoriesMap.get (time.category)! + 1)
      else categoriesMap.set (time.category, 1)
    })

    return Array.from(categoriesMap.entries()).map(([category, count]) => ({category, count}));
  }, [times])

  const timesToShow = useMemo (() => {

    if (! debouncedSearch && !category) return times
    return times.filter (time => {
      
      let show = true
      if (debouncedSearch) show = show && (time.name.indexOf (debouncedSearch) > -1) || (time.surname.indexOf (debouncedSearch) > -1) || (time.club?.indexOf (debouncedSearch) > -1)
      if (category) show = show && (time.category === category)
      return show
    })
  }, [times, debouncedSearch, category])

  return (
    <section>
      <div className='filters-container'>
        <div className="py-4 flex justify-between">
          <div>
            <label htmlFor="categories" className="sr-only">Selecciona una categoría</label>
              <select id="categories" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 w-80 " value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Todas las categorías</option>
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
            <label htmlFor="search" className="sr-only">Busca tu nombre o tu club</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="text" id="search" name="search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50" placeholder="Busca tu nombre o tu club" value={search} onChange={(e) => setSearch(e.target.value)} />
                </form>
                <div className={`absolute inset-y-0 right-0 flex items-center pr-3 ${search !== '' ? 'hover:cursor-pointer' : 'hidden'}`} onClick={() => setSearch('')}>
                  <FontAwesomeIcon icon={faClose} />
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className='times-container'>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
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
                  <tr className="bg-white border-b hover:bg-gray-50 " key={time.id}>
                    <td className='text-center'>{time.generalClasif}</td>
                    <td className='text-center'>{time.categoryClasif}</td>
                    <td className='text-center'>{time.sexClasif}</td>
                    <td className='text-center'>{time.name} {time.surname}</td>
                    <td className='text-center'>{time.category}</td>
                    <td className='text-center'>{time.sex}</td>
                    <td className='text-center'>{time.totalTime}</td>
                    <td className='text-center'>{time.mKm}</td>
                    <td className='text-center'>{time.diffTimeToFirst}</td>
                    <td className='text-center'>{time.club}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </section>
  )
}