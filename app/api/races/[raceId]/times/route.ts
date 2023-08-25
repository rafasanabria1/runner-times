import { CustomError } from '@/app/lib/utils'
import { getAllFromFilters } from '@/app/models/TimeModel'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET (req: NextRequest, { params }: { params: { raceId: string } }) {
  const raceId = params.raceId ?? ''
  const { searchParams } = new URL(req.url)

  const search = decodeURIComponent(searchParams.get('q') ?? '')
  const category = decodeURIComponent(searchParams.get('category') ?? '')
  const club = decodeURIComponent(searchParams.get('club') ?? '')
  const page = searchParams.get('page') !== null ? parseInt(searchParams.get('page') ?? '') : 1
  const perPage = searchParams.get('per_page') !== null ? parseInt(searchParams.get('per_page') ?? '') : 25

  try {
    if (raceId === '') {
      throw new CustomError({ message: 'Debe indicar un id de carrera.', code: 400 })
    }

    const [times, countAll, countFiltered] = await getAllFromFilters({ raceId, search, category, club, page, perPage })

    return NextResponse.json({ times, countAll, countFiltered })
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
