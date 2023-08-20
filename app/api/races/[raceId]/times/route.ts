import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prismadb'
import { type Time } from '@/lib/types'
import { CustomError } from '@/lib/utils'

export async function GET (req: NextRequest, { params }: { params: { raceId: string } }) {
  const { raceId } = params

  const { searchParams } = new URL(req.url)
  const query = {
    search: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? '',
    club: searchParams.get('club') ?? '',
    page: searchParams.get('page') !== null ? parseInt(searchParams.get('page') ?? '') : 1,
    perPage: searchParams.get('per_page') !== null ? parseInt(searchParams.get('per_page') ?? '') : 25
  }

  try {
    if (raceId === '') {
      throw new CustomError({ message: 'El id de la carrera no es válido', code: 400 })
    }

    const times = await prisma.time.findMany({
      where: {
        AND: [
          {
            id: raceId
          },
          {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: 'insensitive'
                }
              },
              {
                surname: {
                  contains: query.search,
                  mode: 'insensitive'
                }
              }
            ]
          },
          {
            category: query.category
          },
          {
            club: query.club
          }
        ]
      },
      take: query.perPage,
      skip: (query.page - 1) * query.perPage,
      orderBy: {
        generalClasif: 'asc'
      }
    })
    if (times === null) {
      throw new CustomError({ message: 'No se ha encontrado la carrera', code: 404 })
    }

    const fullTimes = times.map(time => {
      const { id, raceId, name, surname, sex, category, club, generalClasif, categoryClasif, sexClasif, totalTime, diffTimeToFirst, diffMettersToFirst, mKm } = time
      return {
        id,
        raceId,
        name,
        surname: surname ?? '',
        sex: sex ?? '',
        category: category ?? '',
        club: club ?? '',
        generalClasif: generalClasif ?? 0,
        categoryClasif: categoryClasif ?? 0,
        sexClasif: sexClasif ?? 0,
        totalTime: totalTime ?? '',
        diffTimeToFirst: diffTimeToFirst ?? '',
        diffMettersToFirst: diffMettersToFirst ?? '',
        mKm: mKm ?? ''
      }
    })

    return NextResponse.json(fullTimes)
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
export async function POST (req: NextRequest) {
  const { raceId, times }: { raceId: string, times: Time[] } = await req.json()

  try {
    if (raceId === '' || typeof raceId !== 'string') {
      throw new CustomError({ message: 'El id de la carrera no es válido', code: 400 })
    }

    const race = await prisma.race.findUnique({
      where: {
        id: raceId
      },
      select: {
        id: true,
        name: true
      }
    })

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
