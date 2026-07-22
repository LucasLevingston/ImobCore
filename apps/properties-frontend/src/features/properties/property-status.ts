import type { BadgeProps } from '@microfrontends/ui'
import type { PropertyStatus } from '../../types/property'

// Único lugar que traduz o enum de status pra rótulo visível em pt-BR e pra
// variante de cor do Badge — evita cada feature (list/detail) reimplementar
// o próprio mapeamento e divergir (rótulo diferente em cada tela).
export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  Available: 'Disponível',
  Reserved: 'Reservado',
  Sold: 'Vendido',
  Rented: 'Alugado',
  Inactive: 'Inativo',
}

export const PROPERTY_STATUS_BADGE_VARIANT: Record<
  PropertyStatus,
  NonNullable<BadgeProps['variant']>
> = {
  Available: 'success',
  Reserved: 'warning',
  Sold: 'brand',
  Rented: 'brand',
  Inactive: 'destructive',
}
