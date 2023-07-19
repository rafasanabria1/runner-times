import prisma from "@/libs/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET (req: NextRequest,  { params }: { params: { raceId: string } }) {
  
  const raceId = params.raceId ?? ''

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

  console.log ({race})
  
  return NextResponse.json(race)
} 
