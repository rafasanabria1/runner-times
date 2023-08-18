import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prismadb'
import { type Time } from '@/lib/types'
import { CustomError } from '@/lib/utils'

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
