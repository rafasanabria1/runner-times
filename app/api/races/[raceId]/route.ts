import prisma from '@/prisma/prismadb'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomError } from '@/lib/utils'

export async function GET (req: NextRequest, { params }: { params: { raceId: string } }) {
  const raceId = params.raceId ?? ''
  const { searchParams } = new URL(req.url)
  const filters = searchParams.get('filters') === 'true'

  try {
    if (raceId === '') {
      throw new CustomError({ message: 'El id de la carrera no es válido.', code: 400 })
    }

    const race = await prisma.race.findUnique({
      where: {
        id: raceId
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
      throw new CustomError({ message: 'No se ha encontrado la carrera.', code: 404 })
    }

    const { id, name, link, date, city, distance, _count } = race

    const fullRace = {
      id,
      name,
      link,
      date,
      city: city ?? '',
      distance: distance ?? 0,
      timesCount: _count.times,
      categories: [] as Array<{ name: string, count: number }>,
      clubs: [] as Array<{ name: string, count: number }>
    }

    if (filters) {
      const categories = await prisma.time.groupBy({
        by: ['category'],
        where: {
          raceId
        },
        orderBy: {
          category: 'asc'
        },
        _count: {
          _all: true
        }
      }).then((categories) => {
        return categories.map((category) => {
          return {
            name: category.category ?? '',
            count: category._count._all
          }
        })
      })

      fullRace.categories = categories

      const clubs = await prisma.time.groupBy({
        by: ['club'],
        where: {
          raceId
        },
        orderBy: {
          club: 'asc'
        },
        _count: {
          _all: true
        }
      }).then((clubs) => {
        return clubs.map((club) => {
          return {
            name: club.club ?? '',
            count: club._count._all
          }
        })
      })

      fullRace.clubs = clubs
    }

    return NextResponse.json(fullRace)
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
