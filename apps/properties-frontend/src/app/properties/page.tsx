'use client'

import { ErrorState, Loading } from '@microfrontends/ui'
import Link from 'next/link'
import { useState } from 'react'
import {
  Pagination,
  PropertyFilters,
  type PropertyFilterValues,
  PropertyList,
  useProperties,
} from '@/features/properties/list'

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilterValues>({})
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useProperties({
    ...filters,
    page,
  })

  function handleApply(newFilters: PropertyFilterValues) {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Imóveis</h1>
        <Link
          href="/properties/new"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Novo imóvel
        </Link>
      </div>

      <PropertyFilters initialValues={filters} onApply={handleApply} />

      {isLoading && <Loading label="Carregando imóveis..." />}
      {isError && (
        <ErrorState title="Não foi possível carregar os imóveis" onRetry={() => void refetch()} />
      )}
      {data && (
        <>
          <PropertyList properties={data.items} />
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
