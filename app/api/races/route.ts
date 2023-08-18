import prisma from '@/prisma/prismadb'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomError } from '@/lib/utils'

export async function GET (req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const linkToFilter = searchParams.get('link')

  try {
    if (linkToFilter !== '' && linkToFilter !== null) {
      const race = await prisma.race.findUnique({
        where: {
          link: linkToFilter
        },
        include: {
          times: false,
          _count: {
            select: {
              times: true
            }
          }
        }
      })
      if (race == null) {
        throw new CustomError({ message: 'No se ha encontrado la carrera', code: 404 })
      }

      const { id, name, link, date, city, distance, hasTimes, _count } = race

      return NextResponse.json({
        id,
        name,
        link,
        date,
        city: city ?? '',
        distance: distance ?? 0,
        hasTimes,
        timesCount: _count.times
      })
    } else {
      const races = await prisma.race.findMany({
        include: {
          times: false,
          _count: {
            select: {
              times: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      })

      const fullRaces = races.map(race => {
        const { id, name, link, date, city, distance, hasTimes, _count } = race
        return {
          id,
          name,
          link,
          date,
          city: city ?? '',
          distance: distance ?? 0,
          hasTimes,
          timesCount: _count.times
        }
      })

      return NextResponse.json(fullRaces)
    }
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}

export async function POST (req: NextRequest) {
  const { name, date, link, city } = await req.json()

  try {
    if (name === '') {
      throw new CustomError({ message: 'El nombre de la carrera es obligatorio.', code: 400 })
    }
    if (link === '') {
      throw new CustomError({ message: 'El link de la carrera es obligatorio.', code: 400 })
    }

    const race = await prisma.race.create({
      data: {
        name,
        link,
        date,
        city
      }
    })

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
  const { raceId, distance } = await req.json()

  try {
    if (raceId === '' || typeof raceId !== 'string') {
      throw new CustomError({ message: 'El id de la carrera no es válido.', code: 400 })
    }

    if (distance === '') {
      throw new CustomError({ message: 'La distancia de la carrera no es válida.', code: 400 })
    }

    const race = await prisma.race.update({
      where: {
        id: raceId
      },
      data: {
        distance
      },
      include: {
        times: false
      }
    })

    return NextResponse.json(race)
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
