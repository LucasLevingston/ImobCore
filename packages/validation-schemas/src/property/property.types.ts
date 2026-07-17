import type { PROPERTY_STATUSES, PROPERTY_TYPES } from './property.constants'

export type PropertyType = (typeof PROPERTY_TYPES)[number]
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number]
