import type { PropertyFormFieldsProps } from './PropertyForm.types'

export function PropertyFormAmenityFields({ register }: PropertyFormFieldsProps) {
  return (
    <div className="flex gap-6">
      <label htmlFor="furnished" className="flex items-center gap-2 text-sm font-medium">
        <input id="furnished" type="checkbox" {...register('furnished')} />
        Mobiliado
      </label>
      <label htmlFor="acceptsFinancing" className="flex items-center gap-2 text-sm font-medium">
        <input id="acceptsFinancing" type="checkbox" {...register('acceptsFinancing')} />
        Aceita financiamento
      </label>
      <label htmlFor="acceptsPets" className="flex items-center gap-2 text-sm font-medium">
        <input id="acceptsPets" type="checkbox" {...register('acceptsPets')} />
        Aceita pets
      </label>
    </div>
  )
}
