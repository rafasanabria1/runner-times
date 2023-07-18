import prisma from "@/libs/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET (req: NextRequest) {

  const {searchParams} = new URL (req.url)
  const link = searchParams.get ('link')
  
  let races
  if (link) {
    races = await prisma.race.findUnique({
      where: {
        link
      },
      include: {
        times: false
      }
    })
  } else {
    races = await prisma.race.findMany({
      include: {
        times: false
      },
      orderBy: {
        date: 'desc'
      }
    })
  } 
  
  return NextResponse.json(races)
}

export async function POST (req: NextRequest) {
  const { name, date, link, city } = await req.json()

  if (!name) {
    return NextResponse.json(
      { 
        error: 'El nombre de la carrera es obligatorio.' 
      },
      {
        status: 400
      }
    )
  }
  if (!link) {
    return NextResponse.json(
      { 
        error: 'El link de la carrera es obligatorio.' 
      },
      {
        status: 400
      }
    )
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
}

export async function PUT (req: NextRequest) {
  const { raceId, distance } = await req.json()

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
  if (!distance) {
    return NextResponse.json(
      { 
        error: 'La distancia de la carrera no es válida.'
      },
      {
        status: 400
      }
    )
  }

  try {
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
      return NextResponse.json(
        { 
          error: 'No se ha encontrado la carrera a actualizar.' 
        },
        {
          status: 404
        }
      )
  }
}