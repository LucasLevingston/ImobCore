import { Input } from '@microfrontends/ui'
import type { PropertyFormFieldsProps } from './PropertyForm.types'

export function PropertyFormRoomFields({ register, errors }: PropertyFormFieldsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="space-y-1">
        <label htmlFor="bedrooms" className="text-sm font-medium">
          Quartos
        </label>
        <Input id="bedrooms" type="number" {...register('bedrooms')} />
      </div>
      <div className="space-y-1">
        <label htmlFor="bathrooms" className="text-sm font-medium">
          Banheiros
        </label>
        <Input id="bathrooms" type="number" {...register('bathrooms')} />
      </div>
      <div className="space-y-1">
        <label htmlFor="garageSpaces" className="text-sm font-medium">
          Vagas
        </label>
        <Input id="garageSpaces" type="number" {...register('garageSpaces')} />
      </div>
      <div className="space-y-1">
        <label htmlFor="area" className="text-sm font-medium">
          Área (m²)
        </label>
        <Input id="area" type="number" {...register('area')} error={errors.area?.message} />
      </div>
    </div>
  )
}
