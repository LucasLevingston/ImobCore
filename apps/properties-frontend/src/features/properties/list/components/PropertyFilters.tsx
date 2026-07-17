'use client'

import { Button, Input } from '@microfrontends/ui'
import { type FormEvent, useState } from 'react'
import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyStatus,
  type PropertyType,
} from '../../../../types/property'
import type { PropertyFiltersProps } from './PropertyFilters.types'

export function PropertyFilters({ initialValues, onApply }: PropertyFiltersProps) {
  const [q, setQ] = useState(initialValues?.q ?? '')
  const [city, setCity] = useState(initialValues?.city ?? '')
  const [type, setType] = useState<PropertyType | ''>(initialValues?.type ?? '')
  const [status, setStatus] = useState<PropertyStatus | ''>(initialValues?.status ?? '')
  const [minPrice, setMinPrice] = useState(initialValues?.minPrice?.toString() ?? '')
  const [maxPrice, setMaxPrice] = useState(initialValues?.maxPrice?.toString() ?? '')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply({
      ...(q ? { q } : {}),
      ...(city ? { city } : {}),
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
      ...(minPrice ? { minPrice: Number(minPrice) } : {}),
      ...(maxPrice ? { maxPrice: Number(maxPrice) } : {}),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Filtrar imóveis"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
    >
      <Input
        aria-label="Buscar"
        placeholder="Título, descrição ou endereço"
        value={q}
        onChange={(event) => setQ(event.target.value)}
      />
      <Input
        aria-label="Cidade"
        placeholder="Cidade"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />
      <select
        aria-label="Tipo"
        value={type}
        onChange={(event) => setType(event.target.value as PropertyType | '')}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">Todos os tipos</option>
        {PROPERTY_TYPES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        aria-label="Status"
        value={status}
        onChange={(event) => setStatus(event.target.value as PropertyStatus | '')}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">Todos os status</option>
        {PROPERTY_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Input
        aria-label="Preço mínimo"
        type="number"
        placeholder="Preço mín."
        value={minPrice}
        onChange={(event) => setMinPrice(event.target.value)}
      />
      <Input
        aria-label="Preço máximo"
        type="number"
        placeholder="Preço máx."
        value={maxPrice}
        onChange={(event) => setMaxPrice(event.target.value)}
      />
      <Button type="submit" className="col-span-full sm:col-span-1">
        Filtrar
      </Button>
    </form>
  )
}
