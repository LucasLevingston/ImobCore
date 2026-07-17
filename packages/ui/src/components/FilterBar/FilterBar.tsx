import { FilterBarActions } from './FilterBarActions'
import { FilterBarField } from './FilterBarField'
import { FilterBarRoot } from './FilterBarRoot'

export const FilterBar = Object.assign(FilterBarRoot, {
  Field: FilterBarField,
  Actions: FilterBarActions,
})
