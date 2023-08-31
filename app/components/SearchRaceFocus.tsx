'use client'
export default function SearchRaceFocus () {
  const handleClick = () => {
    document.getElementById('search')?.focus()
  }

  return (
    <div className="grid h-24 lg:h-32 card bg-base-200 rounded-box place-items-center uppercase font-bold hover:cursor-pointer"
      onClick={handleClick}>
        Busca tu carrera
    </div>
  )
}
