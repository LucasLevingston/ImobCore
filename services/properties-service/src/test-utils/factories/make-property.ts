import { randomUUID } from 'node:crypto'
import type { Property } from '../../domain/entities/property.entity'

// Factory: evita repetir a entidade Property inteira em cada teste — só sobrescreve o que importa
export function makeProperty(overrides: Partial<Property> = {}): Property {
  const now = new Date()
  return {
    id: randomUUID(),
    title: 'Apartamento 2 quartos no Centro',
    description: 'Apartamento reformado, próximo ao metrô, ótima iluminação natural.',
    type: 'Apartment',
    status: 'Available',
    price: 350_000,
    condominiumFee: 450,
    iptu: 120,
    bedrooms: 2,
    bathrooms: 1,
    garageSpaces: 1,
    area: 65,
    lotArea: null,
    floor: 3,
    furnished: false,
    acceptsFinancing: true,
    acceptsPets: true,
    address: 'Rua das Flores',
    number: '123',
    district: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    latitude: -23.55052,
    longitude: -46.633308,
    brokerId: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
