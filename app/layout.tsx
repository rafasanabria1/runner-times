import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modern IDEAIN',
  description: 'Página web moderna con datos de carreras obtenidos de IDEA Informática',
}

config.autoAddCss = false

const links = [
  {
    name: 'Home',
    href: '/races'
  },
  {
    name: 'About',
    href: '/about'
  }
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <header className='bg-dark text-white'>
          <div id="header-desktop" className='flex items-center justify-between px-8 py-12'>
            <div className="">
              <span>Modern IDEA - Informática</span>
            </div>
            <nav>
              <ul className='flex gap-4'>
                {
                  links.map (link => {
                    return (
                      <li key={link.href}>
                        <Link className='px-10 py-5 rounded-md hover:cursor-pointer hover:bg-light hover:text-darker transition-colors duration-300' href="/races">{link.name}</Link>
                      </li>
                    )
                  })
                }                
              </ul>
            </nav>
          </div>
        </header>
        <main className="min-h-full h-full flex-grow py-5">
          {children}
        </main>
        <footer className='bg-dark text-white py-8 text-center '>
          Realizado por <a className='hover:underline' href="https://github.com/rafasanabria1/" target='_blank'>@rafasanabria1</a>
        </footer>
      </body>
    </html>
  )
}
