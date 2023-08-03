export class CustomError extends Error {
  
  code = 0

  constructor ({message, code}: {message: string, code: number}) {
    super()
    this.message = message
    this.code = code
  }
}

export function getFullURL (url: string): string {

  const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}${url}`
}
