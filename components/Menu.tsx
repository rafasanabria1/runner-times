'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconRun, IconInfoCircle } from '@tabler/icons-react'

export default function Menu ({ className }: { className: string }) {
  const pathname = usePathname()
  const menuLinks = [
    {
      name: 'Carreras',
      href: '/races',
      icon: <IconRun />
    },
    {
      name: 'Sobre el proyecto',
      href: '/about',
      icon: <IconInfoCircle />
    }
  ].map(link => {
    return {
      ...link,
      isActive: link.href === pathname ? 'active' : ''
    }
  })

  return (
    <ul className={`space-y-2 font-medium ${className}`} >
      {
        menuLinks.map(link => {
          return (
            <li key={link.href}>
                <Link href={link.href} className="flex items-center p-2 rounded-lg group hover:bg-base-100">
                  <span>{link.icon}</span>
                  <span className="hidden desktop:ml-3 desktop:block">{link.name}</span>
                </Link>
            </li>
          )
        })
      }
    </ul>
  )
}
