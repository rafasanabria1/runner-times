import prisma from '@/prisma/prismadb'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomError } from '@/lib/utils'

export async function GET (req: NextRequest, { params }: { params: { raceId: string } }) {
  const raceId = params.raceId ?? ''

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
      timesCount: _count.times
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
