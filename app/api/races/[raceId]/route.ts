import prisma from '@/prisma/prismadb'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomError } from '@/lib/utils'

export async function GET (req: NextRequest, { params }: { params: { raceId: string } }) {
  const raceId = params.raceId ?? ''

  try {
    if (raceId === '' || typeof raceId !== 'string') {
      throw new CustomError({ message: 'El id de la carrera no es válido.', code: 400 })
    }

    const race = await prisma.race.findUnique({
      where: {
        id: raceId
      },
      include: {
        times: {
          orderBy: {
            generalClasif: 'asc'
          }
        }
      }
    })

    if (race == null) {
      throw new CustomError({ message: 'No se ha encontrado la carrera.', code: 404 })
    }

    const { id, name, link, date, city, distance, times } = race
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
    const fullRace = {
      id,
      name,
      link,
      date,
      city: city ?? '',
      distance: distance ?? 0,
      times: fullTimes,
      timesCount: fullTimes.length
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
