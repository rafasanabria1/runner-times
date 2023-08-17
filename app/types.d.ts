export interface Race {
  id?: string
  name: string
  link: string
  date: DateTime
  city: string
  distance: number
  hasTimes: boolean
  dateFormatted?: string
  times?: Time[]
  timesCount?: int
}

export interface Time {
  id?: string
  raceId: string
  name: string
  surname: string
  fullname?: string
  sex: string
  category: string
  club: string
  generalClasif: number
  categoryClasif: number
  sexClasif: number
  totalTime: string
  diffTimeToFirst: string
  diffMettersToFirst: string
  mKm: string
}
