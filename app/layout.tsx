import './globals.css'
import type { Metadata } from 'next'
import Menu from '@/components/Menu'

export const metadata: Metadata = {
  title: 'Runner times',
  description: 'Consutla los tiempos de tus carreras populares'
}

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className=''>
        <aside className="fixed top-0 left-0 z-40 h-screen w-20 desktop:w-96 ">
          <div className="h-full p-5 overflow-y-auto flex flex-col justify-between bg-base-200">
            <div>
              <h1 className='hidden desktop:block desktop:leading-8 desktop:text-3xl desktop:font-bold desktop:text-white desktop:py-5'>
                Runner Times!
              </h1>
              <Menu className="desktop:mt-10"/>
            </div>
            <div className='hidden desktop:block text-xl font-bold text-center text-white py-5'>
              <a href="https://github.com/rafasanabria1/" target='_blank' rel="noreferrer">@rafasanabria1</a>
            </div>
          </div>
        </aside>
        <section className="p-4 ml-20 desktop:ml-96 h-screen overflow-y-auto">
          {children}
        </section>
      </body>
    </html>
  )
}
