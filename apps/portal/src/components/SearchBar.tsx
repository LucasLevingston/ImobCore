'use client'

import { Input, toast } from '@microfrontends/ui'
import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'

// Busca global — placeholder (docs/ARCHITECTURE.md seção 05a): sem backend de
// busca real ainda, só confirma a interação via toast
export function SearchBar() {
  const [query, setQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast({
      title: 'Busca ainda não disponível',
      description: 'Este recurso chega numa fase futura.',
    })
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full max-w-sm">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        aria-label="Pesquisar"
        placeholder="Pesquisar..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="pl-9"
      />
    </form>
  )
}
