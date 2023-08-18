import './globals.css'
import type { Metadata } from 'next'
import Menu from '@/components/Menu'
import { IconBrandGithub } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Runner times',
  description: 'Consutla los tiempos de tus carreras populares'
}

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className=''>
        <aside className="fixed top-0 left-0 z-40 h-screen w-14 desktop:w-72">
          <div className="h-full p-2 desktop:p-5 overflow-y-auto flex flex-col justify-between bg-base-200">
            <div>
              <h1 className='hidden desktop:block desktop:leading-8 desktop:text-3xl desktop:font-bold desktop:py-5'>
                Runner Times!
              </h1>
              <h2 className='block desktop:hidden leading-8 text-2xl font-bold text-center'>
                RT!
              </h2>
              <Menu className="mt-10"/>
            </div>
            <div className=' py-5 font-medium'>
              <a href="https://github.com/rafasanabria1/" className='flex items-center p-2 rounded-lg group hover:bg-base-100' target='_blank' rel="noreferrer">
                <IconBrandGithub />
                <span className="hidden desktop:ml-3 desktop:block">@rafasanabria1</span>
              </a>
            </div>
          </div>
        </aside>
        <section className="p-4 ml-14 desktop:ml-72 h-screen flex flex-col gap-5">
          {children}
        </section>
      </body>
    </html>
  )
}
