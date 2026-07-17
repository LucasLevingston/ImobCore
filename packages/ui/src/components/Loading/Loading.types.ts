import type { sizeClasses } from './Loading.constants'

export interface LoadingProps {
  label?: string
  size?: keyof typeof sizeClasses
  className?: string
}
