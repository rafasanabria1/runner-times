import { type Time } from '@/app/lib/types.d'

export default function TimesTable ({ times }: { times: Time[] }) {
  return (
    <table className="table table-pin-rows">
        <thead className="text-white uppercase">
            <tr className='py-3 [&>th]:px-6 [&>th]:text-center'>
                <th scope="col">Clasificación general</th>
                <th scope="col">Competidor/a</th>
                <th scope="col">Categoría</th>
                <th scope="col">Sexo</th>
                <th scope="col">Tiempo</th>
                <th scope="col">Ritmo (m/km)</th>
                <th scope="col">Diferencia de tiempo con el 1º</th>
                <th scope="col">Club</th>
            </tr>
        </thead>
        <tbody>
            {
            times.length <= 0 && (
                <tr>
                    <td colSpan={8} className="text-center py-4">Sin resultados</td>
                </tr>
            )
            }
            {
            times.map(time => {
              return (
                    <tr className="py-2 hover [&>td]:py-2 [&>td]:text-center" key={time.id}>
                    <td>{time.generalClasif}</td>
                    <td>{time.name} {time.surname?.toString()}</td>
                    <td>{time.category}</td>
                    <td>{time.sex}</td>
                    <td>{time.totalTime}</td>
                    <td>{time.mKm}</td>
                    <td>{time.diffTimeToFirst}</td>
                    <td>{time.club}</td>
                    </tr>
              )
            })
            }
        </tbody>
    </table>
  )
}
