import { type NextRequest, NextResponse } from 'next/server'
import { CustomError } from '@/app/lib/utils'
import { createRace, getAll, getRaceFromLink, getRacesFromFilters, updateRaceDistance, updateRaceImageURL } from '@/app/models/RaceModel'

export async function GET (req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const link = searchParams.get('link') ?? ''
  const search = searchParams.get('q') ?? ''

  try {
    let rawRaces = []
    if (link !== '') rawRaces = await getRaceFromLink(link)
    else if (search !== '') rawRaces = await getRacesFromFilters({ search })
    else rawRaces = await getAll({})

    return NextResponse.json(rawRaces)
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
export async function POST (req: NextRequest) {
  const { name, date, link, city, provider } = await req.json()

  try {
    if (name === '') {
      throw new CustomError({ message: 'El nombre de la carrera es obligatorio.', code: 400 })
    }
    if (link === '') {
      throw new CustomError({ message: 'El link de la carrera es obligatorio.', code: 400 })
    }

    const race = await createRace({ name, date, link, city, provider })

    return NextResponse.json(race)
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}

export async function PUT (req: NextRequest) {
  const { raceId, distance, imageURL } = await req.json()

  try {
    if (raceId === '') {
      throw new CustomError({ message: 'Debe indicar un id de carrera.', code: 400 })
    }

    if (distance === '' && imageURL === '') {
      throw new CustomError({ message: 'Debe indicar un campo para hacer la actualización.', code: 400 })
    }

    let race
    if (distance > 0) race = updateRaceDistance({ id: raceId, distance })
    if (imageURL !== '') race = updateRaceImageURL({ id: raceId, imageURL })

    return NextResponse.json(race)
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
