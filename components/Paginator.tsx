import { DOTS } from '@/app/const'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

    <section className="flex items-center justify-between py-5">
      <div className="flex flex-1 justify-between sm:hidden">
        <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => { setCurrentPage(currentPage - 1) }}>Anterior</button>
        <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => { setCurrentPage(currentPage + 1) }}>Siguiente</button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {
              resultsFilteredCount <= pageSize ? `Mostrando ${resultsFilteredCount} resultados filtrados (${resultsCount} totales).` : `Mostrando del ${firstIndexToShow + 1} al ${lastIndexToShow} de ${resultsFilteredCount} resultados filtrados (${resultsCount} totales).`
            }
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {
              currentPage > 1 && (
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => { setCurrentPage(currentPage - 1) }}>
                  <span className="sr-only">Anterior</span>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
              )
            }
            {
              paginationRange.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                  return <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:cursor-default" key={`${pageNumber}-${index}`}>...</span>
                } else if (pageNumber === currentPage) {
                  return <span aria-current="page" className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" key={`page-${pageNumber}`}>{pageNumber}</span>
                } else {
                  return <button onClick={() => { setCurrentPage(pageNumber) }} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" key={`page${pageNumber}`}>{pageNumber}</button>
                }
              })
            }
            {
              currentPage < lastPage && (
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => { setCurrentPage(currentPage + 1) }}>
                  <span className="sr-only">Siguiente</span>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              )
            }
          </nav>
        </div>
      </div>
    </section>
  )
}
