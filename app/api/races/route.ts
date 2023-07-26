
import prisma from "@/libs/prismadb"
import { NextRequest, NextResponse } from "next/server"
import { CustomError, getFullRace } from "../utils"

export async function GET (req: NextRequest) {

  const {searchParams} = new URL (req.url)
  const linkToFilter = searchParams.get ('link')
  
  try {

    let races
    if (linkToFilter) {
      const race = await prisma.race.findUnique({
        where: {
          link: linkToFilter
        },
        include: {
          times: false
        }
      })
      if (! race) {
        throw new CustomError ({message: 'No se ha encontrado la carrera', code: 404})
      }
      
      const {id, name, link, date, city, distance, hasTimes} = race
      const fullRace = getFullRace({
        id,
        name,
        link,
        date,
        city: city ?? '',
        distance: distance ?? 0,
        hasTimes
      })

      return NextResponse.json(fullRace)
    } else {
      const races = await prisma.race.findMany({
        include: {
          times: false
        },
        orderBy: {
          date: 'desc'
        }
      })

      const fullRaces = races.map (race => {
        const {id, name, link, date, city, distance, hasTimes} = race
        return getFullRace({
          id,
          name,
          link,
          date,
          city: city ?? '',
          distance: distance ?? 0,
          hasTimes
        })
      })

      return NextResponse.json(fullRaces)
    }

  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({error}, { status: 500 })
    }
  }
}

export async function POST (req: NextRequest) {
  const { name, date, link, city } = await req.json()

  try {

    if (!name) {
      throw new CustomError ({message: 'El nombre de la carrera es obligatorio.', code: 400})
    }
    if (!link) {
      throw new CustomError ({message: 'El link de la carrera es obligatorio.', code: 400})
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
    
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({error}, { status: 500 })
    }
  }
}

export async function PUT (req: NextRequest) {
  const { raceId, distance } = await req.json()

  try {

    if (!raceId || typeof raceId !== 'string') {
      throw new CustomError({message: 'El id de la carrera no es válido.', code: 400})
    }

    if (!distance) {
      throw new CustomError({message: 'La distancia de la carrera no es válida.', code: 400})
    }

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
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.code })
    } else {
      return NextResponse.json({error}, { status: 500 })
    }
  }
}