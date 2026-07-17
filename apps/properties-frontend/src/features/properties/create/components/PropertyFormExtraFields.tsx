import { Input } from '@microfrontends/ui'
import type { PropertyFormFieldsProps } from './PropertyForm.types'

export function PropertyFormExtraFields({ register }: PropertyFormFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label htmlFor="lotArea" className="text-sm font-medium">
          Área do terreno (m²)
        </label>
        <Input id="lotArea" type="number" {...register('lotArea')} />
      </div>
      <div className="space-y-1">
        <label htmlFor="floor" className="text-sm font-medium">
          Andar
        </label>
        <Input id="floor" type="number" {...register('floor')} />
      </div>
    </div>
  )
}
