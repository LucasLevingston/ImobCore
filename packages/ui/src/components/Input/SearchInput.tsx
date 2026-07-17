import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Input } from './Input'
import type { SearchInputProps } from './SearchInput.types'

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, className, ...props }, ref) => {
    const hasValue = typeof value === 'string' && value.length > 0

    return (
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 flex h-10 w-9 items-center justify-center text-muted-foreground">
          <Search className="h-4 w-4" aria-hidden="true" />
        </div>

        <Input
          ref={ref}
          type="search"
          value={value}
          className={cn('pl-9', hasValue && onClear && 'pr-9', className)}
          {...props}
        />

        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpar busca"
            className="absolute right-0 top-0 flex h-10 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  },
)
SearchInput.displayName = 'SearchInput'
