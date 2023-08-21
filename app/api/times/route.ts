import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prismadb'
import { type Time } from '@/lib/types'
import { CustomError } from '@/lib/utils'
import { type Prisma } from '@prisma/client'

export async function GET (req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = {
    raceId: searchParams.get('raceId') ?? '',
    search: decodeURIComponent(searchParams.get('q') ?? ''),
    category: decodeURIComponent(searchParams.get('category') ?? ''),
    club: decodeURIComponent(searchParams.get('club') ?? ''),
    page: searchParams.get('page') !== null ? parseInt(searchParams.get('page') ?? '') : 1,
    perPage: searchParams.get('per_page') !== null ? parseInt(searchParams.get('per_page') ?? '') : 25
  }

  try {
    if (query.raceId === '') {
      throw new CustomError({ message: 'El id de la carrera no es válido', code: 400 })
    }

    const queryOptions: Prisma.TimeFindManyArgs = {
      where: {
        AND: [
          {
            raceId: query.raceId
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
          }
        ]
      },
      take: query.perPage,
      skip: (query.page - 1) * query.perPage,
      orderBy: {
        generalClasif: 'asc'
      }
    }

    const queryCountOptions: Prisma.TimeCountArgs = {
      where: {
        AND: [
          {
            raceId: query.raceId
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
          }
        ]
      }
    }

    if (query.category !== '' && Array.isArray(queryOptions.where?.AND) && Array.isArray(queryCountOptions.where?.AND)) {
      queryOptions.where?.AND.push({ category: decodeURI(query.category) })
      queryCountOptions.where?.AND.push({ category: decodeURI(query.category) })
    }
    if (query.club !== '' && Array.isArray(queryOptions.where?.AND) && Array.isArray(queryCountOptions.where?.AND)) {
      queryOptions.where?.AND.push({ club: decodeURI(query.club) })
      queryCountOptions.where?.AND.push({ club: decodeURI(query.club) })
    }

    const times = await prisma.time.findMany(queryOptions)
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

    const countAll = await prisma.time.count({
      where: {
        raceId: query.raceId
      }
    })

    const countFiltered = await prisma.time.count(queryCountOptions)

    return NextResponse.json({ times: fullTimes, countAll, countFiltered })
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
