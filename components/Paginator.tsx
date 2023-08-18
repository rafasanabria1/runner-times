import { DOTS } from '@/app/const'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface PaginationProps {
  currentPage: number
  pageSize: number
  resultsFilteredCount: number
  resultsCount: number
  paginationRange: Array<number | typeof DOTS>
  firstIndexToShow: number
  lastIndexToShow: number
  setCurrentPage: (page: number) => void
}

export default function Paginator ({ currentPage, pageSize, resultsFilteredCount, resultsCount, paginationRange, firstIndexToShow, lastIndexToShow, setCurrentPage }: PaginationProps) {
  const lastPage = Math.ceil(resultsFilteredCount / pageSize)

  return (

    <section className="flex items-center justify-between flex-col desktop:flex-row gap-5">
      <div className='text-xs desktop:text-lg'>
        {
          resultsFilteredCount <= pageSize ? `Mostrando ${resultsFilteredCount} resultados filtrados (${resultsCount} totales).` : `Mostrando del ${firstIndexToShow + 1} al ${lastIndexToShow} de ${resultsFilteredCount} resultados filtrados (${resultsCount} totales).`
        }
      </div>
      <div>
        <nav className="join" aria-label="Pagination">
          <button className={`join-item btn btn-xs desktop:btn-md ${currentPage <= 1 ? 'btn-disabled' : ''}`} onClick={() => { setCurrentPage(currentPage - 1) }}>
            <span className="sr-only">Anterior</span>
            <IconChevronLeft />
          </button>
          {
            paginationRange.map((pageNumber, index) => {
              if (pageNumber === DOTS) {
                return <span className="join-item btn btn-xs btn-disabled desktop:btn-md" key={`${pageNumber}-${index}`}>...</span>
              } else if (pageNumber === currentPage) {
                return <button aria-current="page" className="join-item btn btn-xs btn-active desktop:btn-md" key={`page-${pageNumber}`} >{pageNumber}</button>
              } else {
                return <button onClick={() => { setCurrentPage(pageNumber) }} className="join-item btn btn-xs desktop:btn-md" key={`page${pageNumber}`}>{pageNumber}</button>
              }
            })
          }
          <button className={`join-item btn btn-xs desktop:btn-md ${currentPage >= lastPage ? 'btn-disabled' : ''}`} onClick={() => { setCurrentPage(currentPage + 1) }}>
            <span className="sr-only">Siguiente</span>
            <IconChevronRight />
          </button>
        </nav>
      </div>
    </section>
  )
}
