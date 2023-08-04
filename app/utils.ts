export class CustomError extends Error {
  
  code = 0

  constructor ({message, code}: {message: string, code: number}) {
    super()
    this.message = message
    this.code = code
  }
}

export function getFullURL (url: string): string {

  return `${process.env.BASE_URL}${url}`
}
