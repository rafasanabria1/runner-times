'use client'
import Image from 'next/image'
import { IconPhotoOff } from '@tabler/icons-react'
import { useBreakpoint } from '../lib/hooks'
import { breakpoints } from '../lib/const'

export default function RaceImage ({ url, alt }: { url: string | null | undefined, alt: string }) {
  const breakpoint = useBreakpoint()
  const urlDefined = (url !== null && url !== undefined && url !== '')
  if (!urlDefined && breakpoint <= breakpoints.sm) return null

  return (
    <div className="h-48 w-36 rounded-lg border border-white mx-auto border-opacity-20">
        {
          urlDefined &&
            <Image src={url} alt={alt} className='object-fill w-full h-full' width={144} height={160} />
        }
        {
          !urlDefined && (
            <span className='grid place-items-center w-full h-full'>
              <IconPhotoOff className='w-8 h-8'/>
            </span>
          )
        }
    </div>
  )
}
