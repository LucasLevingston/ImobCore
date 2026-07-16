import type { CreatePropertyInput } from '../../application/dto/create-property.dto'

// Factory: payload válido mínimo pros testes de DTO/use case — só sobrescreve o que importa
export function makeCreatePropertyInput(
  overrides: Partial<CreatePropertyInput> = {},
): CreatePropertyInput {
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
