import type { Property } from '../../../domain/entities/property.entity'
import type { Property as PrismaProperty } from '../../../generated/prisma/client'

export function toDomain(record: PrismaProperty): Property {
  return {
    ...record,
    price: record.price.toNumber(),
    condominiumFee: record.condominiumFee?.toNumber() ?? null,
    iptu: record.iptu?.toNumber() ?? null,
    area: record.area.toNumber(),
    lotArea: record.lotArea?.toNumber() ?? null,
    latitude: record.latitude?.toNumber() ?? null,
    longitude: record.longitude?.toNumber() ?? null,
  }
}
