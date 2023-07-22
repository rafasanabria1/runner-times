'use client'
import ArrowUp from '@/app/components/icons/ArrowUp'

export default function ScrollToTop () {
  return (
    <div className='fixed bottom-10 right-10 z-10 opacity-40 hover:opacity-100'>
      <button className='bg-gray-800 rounded-full text-white p-2' onClick={() => window.scrollTo( 0, 0 )}>
        <ArrowUp />
      </button>
    </div>
  )
}