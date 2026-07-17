import type { sizeConfig } from './Logo.constants'

export interface LogoProps {
  variant?: 'full' | 'icon'
  size?: keyof typeof sizeConfig
  href?: string
  className?: string
}
