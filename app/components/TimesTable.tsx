'use client'
import { Time } from "../types"

export default function TimesTable ({times}: {times: Time[] | undefined}) {

  if (! times) return null

  return (
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
          times.length <= 0 && (
            <tr>
              <td colSpan={10} className="text-center py-4">Sin resultados</td>
            </tr>
          )
        }
        {
          times.map ((time: Time) => {
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
  )
}