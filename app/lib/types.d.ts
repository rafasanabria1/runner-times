export interface RaceInput {
  name: string
  link: string
  provider?: string | null
  date?: DateTime | null
  city?: string | null
  distance?: number | null
  imageURL?: string | null
}

export interface Race extends RaceInput {
  id: string
  _count?: {
    times: int
  }
  categories?: Array<{ name: string, count: number }>
  clubs?: Array<{ name: string, count: number }>
}

export interface TimeInput {
  raceId: string
  name: string
  surname?: string | null
  fullname?: string | null
  sex?: string | null
  category?: string | null
  club?: string | null
  generalClasif?: number | null
  categoryClasif?: number | null
  sexClasif?: number | null
  totalTime?: string | null
  diffTimeToFirst?: string | null
  diffMettersToFirst?: string | null
  mKm?: string | null
}

export interface Time extends TimeInput {
  id?: string
}

export interface timesQueryParams {
  raceId: string
  q?: string
  category?: string
  club?: string
  page?: string
  perPage?: string
}
