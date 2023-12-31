import { type NextRequest, NextResponse } from 'next/server'
import { CustomError } from '@/app/lib/utils'
import { getRaceFromId, getRaceCategoriesWithCount, getRaceClubsWithCount } from '@/app/models/RaceModel'

export async function GET (req: NextRequest, { params }: { params: { raceId: string } }) {
  const raceId = params.raceId ?? ''
  const { searchParams } = new URL(req.url)
  const filters = searchParams.get('filters') === 'true'

  try {
    if (raceId === '') {
      throw new CustomError({ message: 'Debe indicar un id de carrera.', code: 400 })
    }

    const race = await getRaceFromId(raceId)

    if (race == null) {
      throw new CustomError({ message: 'No se ha encontrado la carrera.', code: 404 })
    }

    if (filters) {
      const [categories, clubs] = await Promise.all([getRaceFromId(raceId), getRaceCategoriesWithCount(raceId), getRaceClubsWithCount(raceId)])
      return NextResponse.json({ race, categories, clubs })
    }

    return NextResponse.json(race)
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
