import type { PropertyFormValues } from '../../features/properties/create/schemas/property-form.schema'

// Factory: evita repetir o objeto de formulário inteiro em cada teste — só sobrescreve o que importa
export function makePropertyFormValues(
  overrides: Partial<PropertyFormValues> = {},
): PropertyFormValues {
  return {
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
    ...overrides,
  }
}
