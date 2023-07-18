import prisma from "@/libs/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET (req: NextRequest) {
  
  const { raceId } = await req.json()

  if (!raceId || typeof raceId !== 'string') {
    return NextResponse.json(
      { 
        error: 'El id de la carrera no es válido.'
      },
      {
        status: 400
      }
    )
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
  
  return NextResponse.json(race)
} 
