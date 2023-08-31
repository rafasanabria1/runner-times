'use client'
import { type Race, type Time } from '@/app/lib/types'
import { useCallback, useEffect, useState } from 'react'
import { useBreakpoint, usePagination } from '@/app/lib/hooks'
import { NOCLUB, breakpoints } from '@/app/lib/const'
import Paginator from '@/app/components/Paginator'
import { IconX } from '@tabler/icons-react'
import { usePathname, useRouter } from 'next/navigation'
import TimesTable from './TimesTable'
import TimesList from './TimesList'

export default function TimesResults ({
  race,
  categories,
  clubs,
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
  categories: Array<{ name: string, count: number }>
  clubs: Array<{ name: string, count: number }>
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
  const pathname = usePathname()
  const breakpoint = useBreakpoint()
  const [search, setSearch] = useState(searchValue)
  const [category, setCategory] = useState(categoryValue)
  const [club, setClub] = useState(clubValue)
  const [currentPage, setCurrentPage] = useState(pageValue)
  const [pageSize, setPageSize] = useState(perPageValue)

  const { paginationRange, firstIndexToShow, lastIndexToShow } = usePagination({ currentPage, pageSize, totalCount: timesCountFiltered })

  const createQueryString = useCallback(() => {
    const params = new URLSearchParams([
      ['q', encodeURI(search)],
      ['category', encodeURI(category)],
      ['club', encodeURI(club)],
      ['page', currentPage.toString()],
      ['per_page', pageSize.toString()]
    ])

    return params.toString()
  }, [search, category, club, currentPage, pageSize])

  const removeFilters = () => {
    setCategory('')
    setClub('')
    setSearch('')
  }

  useEffect(() => {
    if ((category !== '' || club !== '' || search !== '') && currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [category, club, search, currentPage])

  useEffect(() => {
    const queryString = createQueryString()
    router.push(`${pathname}?${queryString}`)
  }, [router, pathname, createQueryString])

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
        {
            breakpoint <= breakpoints.md && (<TimesList times={times} />)
        }
        {
            breakpoint > breakpoints.md && (<TimesTable times={times} />)
        }
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
