'use client'
import ArrowUp from '@/app/components/icons/ArrowUp'

export default function ScrollToTop () {
  return (
    <div className='fixed bottom-10 right-10 z-10 opacity-40 hover:opacity-100'>
      <button className='bg-gray-800 rounded-full text-white p-2' onClick={() => window.scrollTo({top: 0, left: 0, behavior: 'smooth'})}>
        <ArrowUp />
      </button>
    </div>
  )
}