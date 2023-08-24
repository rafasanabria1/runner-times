import { CustomError } from '@/app/lib/utils'
import { getRaceFromId } from '@/app/models/RaceModel'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET (req: NextRequest, { params }: { params: { raceId: string } }) {
  const raceId = params.raceId ?? ''

  try {
    if (raceId === '') {
      throw new CustomError({ message: 'Debe indicar un id de carrera.', code: 400 })
    }
    const race = await getRaceFromId(raceId)
    if (race == null) {
      throw new CustomError({ message: 'No se ha encontrado la carrera.', code: 404 })
    }
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
