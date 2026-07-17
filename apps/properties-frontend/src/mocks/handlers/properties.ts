import { HttpResponse, http } from 'msw'
import type { DashboardMetrics, PaginatedResult, Property } from '../../types/property'

const BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:3004'

export const MOCK_PROPERTY: Property = {
  id: 'property-1',
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
  brokerId: 'broker-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const MOCK_METRICS: DashboardMetrics = {
  total: 3,
  byStatus: { Available: 1, Reserved: 0, Sold: 1, Rented: 1, Inactive: 0 },
  averagePrice: 300_000,
  byCity: [{ city: 'São Paulo', count: 2 }],
  byDistrict: [{ district: 'Centro', count: 2 }],
}

function paginated(items: Property[]): PaginatedResult<Property> {
  return { items, total: items.length, page: 1, limit: 20, totalPages: 1 }
}

export const propertiesHandlers = [
  http.get(`${BASE}/api/properties/metrics`, () => {
    return HttpResponse.json(MOCK_METRICS, { status: 200 })
  }),

  http.get(`${BASE}/api/properties/search`, () => {
    return HttpResponse.json(paginated([MOCK_PROPERTY]), { status: 200 })
  }),

  http.get(`${BASE}/api/properties/:id`, ({ params }) => {
    if (params.id !== MOCK_PROPERTY.id) {
      return HttpResponse.json({ message: 'Imóvel não encontrado.' }, { status: 404 })
    }
    return HttpResponse.json(MOCK_PROPERTY, { status: 200 })
  }),

  http.get(`${BASE}/api/properties`, () => {
    return HttpResponse.json(paginated([MOCK_PROPERTY]), { status: 200 })
  }),

  http.post(`${BASE}/api/properties`, async ({ request }) => {
    const body = (await request.json()) as Partial<Property>
    return HttpResponse.json({ ...MOCK_PROPERTY, ...body, id: 'property-new' }, { status: 201 })
  }),

  http.put(`${BASE}/api/properties/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Partial<Property>
    return HttpResponse.json(
      { ...MOCK_PROPERTY, ...body, id: params.id as string },
      { status: 200 },
    )
  }),

  http.delete(`${BASE}/api/properties/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
