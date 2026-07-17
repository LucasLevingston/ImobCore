import { Input } from '@microfrontends/ui'
import type { PropertyFormFieldsProps } from './PropertyForm.types'

export function PropertyFormPricingFields({ register, errors }: PropertyFormFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-1">
        <label htmlFor="price" className="text-sm font-medium">
          Preço
        </label>
        <Input id="price" type="number" {...register('price')} error={errors.price?.message} />
      </div>
      <div className="space-y-1">
        <label htmlFor="condominiumFee" className="text-sm font-medium">
          Condomínio
        </label>
        <Input id="condominiumFee" type="number" {...register('condominiumFee')} />
      </div>
      <div className="space-y-1">
        <label htmlFor="iptu" className="text-sm font-medium">
          IPTU
        </label>
        <Input id="iptu" type="number" {...register('iptu')} />
      </div>
    </div>
  )
}
