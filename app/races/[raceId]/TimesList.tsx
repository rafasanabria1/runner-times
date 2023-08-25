import { type Time } from '@/app/lib/types.d'

export default function TimesList ({ times }: { times: Time[] }) {
  return (
    <div className="grid gap-2">
        {
            times.length <= 0 && (<article className='py-2 text-center'>Sin resultados</article>)
        }
        {
            times.map(time => {
              return (
                <article className="rounded-lg bg-base-200 grid items-center p-4 text-xs" key={time.id}>
                    <div className='flex gap-6 items-center'>
                        <div className='flex flex-col gap-2 justify-between'>
                            <span className='text-center'>{time.generalClasif}</span>
                            <hr className='opacity-25'/>
                            <span className='text-center'>{time.totalTime}</span>
                        </div>
                        <div className='grow flex flex-col'>
                            <span className='text-lg font-bold'>{time.name} {time.surname?.toString()}</span>
                            <span className='opacity-80'>Categoría: {time.category}</span>
                            <span className='opacity-80'>Club: {time.club}</span>
                        </div>
                    </div>
                </article>
              )
            })
        }
    </div>
  )
}
