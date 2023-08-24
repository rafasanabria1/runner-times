import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prismadb'
import { type TimeInput } from '@/app/lib/types'
import { CustomError } from '@/app/lib/utils'
import { getAllFromFilters } from '@/app/models/TimeModel'
import { getRaceFromId } from '@/app/models/RaceModel'

export async function GET (req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const raceId = searchParams.get('raceId') ?? ''
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

export async function POST (req: NextRequest) {
  const { raceId, times }: { raceId: string, times: TimeInput[] } = await req.json()

  try {
    if (raceId === '') {
      throw new CustomError({ message: 'Debe indicar un id de carrera.', code: 400 })
    }

    const race = await getRaceFromId(raceId)

    if (race == null) {
      throw new CustomError({ message: 'No se ha encontrado la carrera', code: 404 })
    }

    const newTimes = times.map(time => {
      return { ...time, raceId }
    })

    const insertedTimes = await prisma.time.createMany({
      data: newTimes
    })

    return NextResponse.json({ race, insertedTimes })
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
