import type { ReactNode } from 'react'

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export interface SocialLink {
  label: string
  href: string
  icon: string
}

export interface SEOProps {
  title: string
  description: string
  ogImage?: string
}

export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}
