import { NextRequest, NextResponse } from "next/server"
import prisma from "@/libs/prismadb"
import { Time } from "@/app/types"

export async function POST (req: NextRequest) {

  const { raceId, times }: {raceId: string, times: Time[]} = await req.json()

  if (!raceId || typeof raceId !== 'string') {
    return NextResponse.json({ 
      error: 'El id de la carrera no es válido.'
    }, 
    {
      status: 400
    })
  }
  
  try {
    
    await prisma.race.findUniqueOrThrow ({
      where: {
        id: raceId
      },
      select: {
        id: true,
        name: true
      }
    })

    const newTimes = times.map (time => {
      return {...time, raceId}
    })

    const insertedTimes = await prisma.time.createMany ({
      data: newTimes
    })

    const race = await prisma.race.update({
      where: {
        id: raceId
      },
      data: {
        hasTimes: true
      },
      include: {
        times: false
      }
    })

    return NextResponse.json({race, insertedTimes})

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'No se ha encontrado la carrera para guardar los tiempos.'
      },
      {
        status: 404
      }
    )
  }
}
