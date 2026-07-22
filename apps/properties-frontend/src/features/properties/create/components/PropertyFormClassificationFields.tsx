import { PROPERTY_STATUSES, PROPERTY_TYPES } from '../../../../types/property'
import { PROPERTY_STATUS_LABELS } from '../../property-status'
import type { PropertyFormFieldsProps } from './PropertyForm.types'

export function PropertyFormClassificationFields({ register }: PropertyFormFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label htmlFor="type" className="text-sm font-medium">
          Tipo
        </label>
        <select
          id="type"
          {...register('type')}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors duration-150"
        >
          {PROPERTY_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors duration-150"
        >
          {PROPERTY_STATUSES.map((option) => (
            <option key={option} value={option}>
              {PROPERTY_STATUS_LABELS[option]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
