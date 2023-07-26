import { Race } from "../types.d";

export function getFullRace (race: Race): Race {

  if (! race) return race

  let dateFormatted = ''
  if (race.date) dateFormatted = (new Date(race.date)).toLocaleDateString('es-ES', { 
    month: "2-digit",
    day: "2-digit",
  })
  
  return {
    ...race,
    dateFormatted
  }
}


export class CustomError extends Error {
  
  code = 0

  constructor ({message, code}: {message: string, code: number}) {
    super()
    this.message = message
    this.code = code
  }
}