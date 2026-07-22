'use client'

import { Button, ErrorState } from '@microfrontends/ui'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  Pagination,
  PropertyFilters,
  type PropertyFilterValues,
  PropertyList,
  PropertyListSkeleton,
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
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Imóveis</h1>
          <p className="text-sm text-muted-foreground">Gerencie o seu portfólio de imóveis.</p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo imóvel
          </Link>
        </Button>
      </div>

      <PropertyFilters initialValues={filters} onApply={handleApply} />

      {isLoading && <PropertyListSkeleton />}
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
