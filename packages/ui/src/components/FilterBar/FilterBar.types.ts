import type * as React from 'react'

export interface FilterBarProps {
  children: React.ReactNode
  activeCount?: number
  onClear?: () => void
  className?: string
}

export interface FilterBarFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

export interface FilterBarActionsProps {
  children: React.ReactNode
  className?: string
}
