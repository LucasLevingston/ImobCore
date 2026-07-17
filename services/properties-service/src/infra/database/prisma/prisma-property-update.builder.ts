import type { UpdatePropertyData } from '../../../domain/repositories/property-mutation-data.types'
import type { Prisma } from '../../../generated/prisma/client'

export function buildUpdateData(data: UpdatePropertyData): Prisma.PropertyUpdateInput {
  return {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.type !== undefined ? { type: data.type } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.price !== undefined ? { price: data.price } : {}),
    ...(data.condominiumFee !== undefined ? { condominiumFee: data.condominiumFee } : {}),
    ...(data.iptu !== undefined ? { iptu: data.iptu } : {}),
    ...(data.bedrooms !== undefined ? { bedrooms: data.bedrooms } : {}),
    ...(data.bathrooms !== undefined ? { bathrooms: data.bathrooms } : {}),
    ...(data.garageSpaces !== undefined ? { garageSpaces: data.garageSpaces } : {}),
    ...(data.area !== undefined ? { area: data.area } : {}),
    ...(data.lotArea !== undefined ? { lotArea: data.lotArea } : {}),
    ...(data.floor !== undefined ? { floor: data.floor } : {}),
    ...(data.furnished !== undefined ? { furnished: data.furnished } : {}),
    ...(data.acceptsFinancing !== undefined ? { acceptsFinancing: data.acceptsFinancing } : {}),
    ...(data.acceptsPets !== undefined ? { acceptsPets: data.acceptsPets } : {}),
    ...(data.address !== undefined ? { address: data.address } : {}),
    ...(data.number !== undefined ? { number: data.number } : {}),
    ...(data.district !== undefined ? { district: data.district } : {}),
    ...(data.city !== undefined ? { city: data.city } : {}),
    ...(data.state !== undefined ? { state: data.state } : {}),
    ...(data.zipCode !== undefined ? { zipCode: data.zipCode } : {}),
    ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
    ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
  }
}
