import prisma from '@/prisma/prismadb'
import { type Prisma } from '@prisma/client'
import { NOCLUB } from '@/app/lib/const'

const selectObject = {
  id: true,
  name: true,
  link: true,
  date: true,
  city: true,
  distance: true,
  times: false,
  _count: {
    select: {
      times: true
    }
  }
}

export async function getAll ({ search = '', orderBy = 'date', order = 'asc' }: { search?: string, orderBy?: string, order?: 'asc' | 'desc' }) {
  return await prisma.race.findMany({
    select: selectObject,
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          city: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    },
    orderBy: {
      [orderBy]: order
    }
  })
}

export async function getRaceFromId (id: string) {
  return await prisma.race.findUnique({
    where: {
      id
    },
    select: selectObject
  })
}

export async function getRaceFromLink (link: string) {
  return await prisma.race.findMany({
    where: {
      link
    },
    select: selectObject
  })
}

export async function getRacesFromFilters ({
  search = '',
  page = 1,
  perPage = 10,
  orderBy = 'date',
  order = 'asc'
}: {
  search?: string
  page?: number
  perPage?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}) {
  const queryOptions: Prisma.RaceFindManyArgs = {
    select: selectObject,
    where: {
      AND: []
    },
    orderBy: {
      [orderBy]: order
    },
    take: perPage,
    skip: (page - 1) * perPage
  }

  if (search !== '' && Array.isArray(queryOptions.where?.AND)) {
    queryOptions.where?.AND.push({
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          city: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    })
  }

  return await prisma.race.findMany(queryOptions)
}

export async function createRace ({ name, date, link, city }: { name: string, date: Date, link: string, city: string }) {
  return await prisma.race.create({
    data: {
      name,
      link,
      date,
      city
    }
  })
}

export async function updateRaceDistance ({ id, distance }: { id: string, distance: number }) {
  return await prisma.race.update({
    select: selectObject,
    where: {
      id
    },
    data: {
      distance
    }
  })
}

export async function getRaceCategoriesWithCount (raceId: string): Promise<Array<{ name: string, count: number }>> {
  return await prisma.time.groupBy({
    by: ['category'],
    where: {
      raceId
    },
    orderBy: {
      category: 'asc'
    },
    _count: {
      _all: true
    }
  }).then((categories) => {
    return categories.map((category) => {
      return {
        name: category.category ?? '',
        count: category._count._all
      }
    })
  })
}

export async function getRaceClubsWithCount (raceId: string): Promise<Array<{ name: string, count: number }>> {
  return await prisma.time.groupBy({
    by: ['club'],
    where: {
      raceId
    },
    orderBy: {
      club: 'asc'
    },
    _count: {
      _all: true
    }
  }).then((clubs) => {
    return clubs.map((club) => {
      return {
        name: club.club ?? NOCLUB,
        count: club._count._all
      }
    })
  })
}
