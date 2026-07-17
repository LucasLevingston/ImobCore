import { Input } from '@microfrontends/ui'
import type { PropertyFormFieldsProps } from './PropertyForm.types'

export function PropertyFormAddressFields({ register, errors }: PropertyFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="address" className="text-sm font-medium">
            Endereço
          </label>
          <Input id="address" {...register('address')} error={errors.address?.message} />
        </div>
        <div className="space-y-1">
          <label htmlFor="number" className="text-sm font-medium">
            Número
          </label>
          <Input id="number" {...register('number')} error={errors.number?.message} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1">
          <label htmlFor="district" className="text-sm font-medium">
            Bairro
          </label>
          <Input id="district" {...register('district')} error={errors.district?.message} />
        </div>
        <div className="space-y-1">
          <label htmlFor="city" className="text-sm font-medium">
            Cidade
          </label>
          <Input id="city" {...register('city')} error={errors.city?.message} />
        </div>
        <div className="space-y-1">
          <label htmlFor="state" className="text-sm font-medium">
            UF
          </label>
          <Input id="state" maxLength={2} {...register('state')} error={errors.state?.message} />
        </div>
        <div className="space-y-1">
          <label htmlFor="zipCode" className="text-sm font-medium">
            CEP
          </label>
          <Input id="zipCode" {...register('zipCode')} error={errors.zipCode?.message} />
        </div>
      </div>
    </>
  )
}
