import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modern IDEAIN',
  description: 'Página web moderna con datos de carreras obtenidos de IDEA Informática',
}

config.autoAddCss = false

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col `}>
        <header className='mx-auto w-full'>
          <div className='flex items-center justify-between p-8'>
            <div className="">
              <span>Modern IDEA - Informática</span>
            </div>
            <nav>
              <ul className='flex gap-4'>
                <li>
                  <Link href="/races">Home</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className='flex bg-red-400 place-content-center'>
          Footer
        </footer>
      </body>
    </html>
  )
}
