import prisma from '@/prisma/prismadb'
import { type Prisma } from '@prisma/client'
import { type TimeInput } from '../lib/types'
import { NOCLUB } from '../lib/const'

const selectObject = {
  id: true,
  raceId: true,
  name: true,
  surname: true,
  sex: true,
  category: true,
  club: true,
  generalClasif: true,
  categoryClasif: true,
  sexClasif: true,
  totalTime: true,
  diffTimeToFirst: true,
  diffMettersToFirst: true,
  mKm: true
}

export async function getAllFromFilters ({
  raceId,
  search = '',
  category = '',
  club = '',
  page = 1,
  perPage = 10,
  orderBy = 'generalClasif',
  order = 'asc'
}: {
  raceId: string
  search?: string
  category?: string
  club?: string
  page?: number
  perPage?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}) {
  const queryOptions: Prisma.TimeFindManyArgs = {
    select: selectObject,
    where: {
      AND: [
        {
          raceId
        },
        {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            },
            {
              surname: {
                contains: search,
                mode: 'insensitive'
              }
            }
          ]
        }
      ]
    },
    take: perPage,
    skip: (page - 1) * perPage,
    orderBy: {
      [orderBy]: order
    }
  }

  const queryCountOptions: Prisma.TimeCountArgs = {
    where: {
      AND: [
        {
          raceId
        },
        {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            },
            {
              surname: {
                contains: search,
                mode: 'insensitive'
              }
            }
          ]
        }
      ]
    }
  }

  console.log({ search })

  if (category !== '' && Array.isArray(queryOptions.where?.AND) && Array.isArray(queryCountOptions.where?.AND)) {
    queryOptions.where?.AND.push({ category })
    queryCountOptions.where?.AND.push({ category })
  }
  if (club !== '' && Array.isArray(queryOptions.where?.AND) && Array.isArray(queryCountOptions.where?.AND)) {
    queryOptions.where?.AND.push({
      club: club === NOCLUB ? { isSet: false } : club
    })
    queryCountOptions.where?.AND.push({
      club: club === NOCLUB ? { isSet: false } : club
    })
  }
  return await Promise.all([prisma.time.findMany(queryOptions), prisma.time.count({ where: { raceId } }), prisma.time.count(queryCountOptions)])
}

export async function createTime ({ raceId, times }: { raceId: string, times: TimeInput[] }) {
  const newTimes = times.map(time => {
    return { ...time, raceId }
  })
  return await prisma.time.createMany({
    data: newTimes
  })
}
