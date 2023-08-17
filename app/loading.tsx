import { IconLoader2 } from '@tabler/icons-react'

export default function Loading () {
  return (
    <div className='grow grid place-content-center h-screen'>
      <IconLoader2 className='animate-spin' />
    </div>
  )
}
