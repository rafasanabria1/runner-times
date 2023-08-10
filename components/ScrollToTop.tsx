'use client'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ScrollToTop () {
  return (
    <div className='fixed bottom-10 right-10 z-10 opacity-40 hover:opacity-100'>
      <button className='bg-gray-800 rounded-full text-white p-2 w-12 h-12' onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }) }}>
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  )
}
