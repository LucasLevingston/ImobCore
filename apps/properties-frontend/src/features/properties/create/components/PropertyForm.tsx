'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@microfrontends/ui'
import { useForm } from 'react-hook-form'
import { PROPERTY_STATUSES, PROPERTY_TYPES } from '../../../../types/property'
import { propertyFormSchema, type PropertyFormValues } from '../schemas/property-form.schema'

export interface PropertyFormProps {
  defaultValues?: Partial<PropertyFormValues>
  onSubmit: (values: PropertyFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

const EMPTY_DEFAULTS: PropertyFormValues = {
  title: '',
  description: '',
  type: 'Apartment',
  status: 'Available',
  price: 0,
  condominiumFee: null,
  iptu: null,
  bedrooms: 0,
  bathrooms: 0,
  garageSpaces: 0,
  area: 0,
  lotArea: null,
  floor: null,
  furnished: false,
  acceptsFinancing: false,
  acceptsPets: false,
  address: '',
  number: '',
  district: '',
  city: '',
  state: '',
  zipCode: '',
  latitude: null,
  longitude: null,
}

export function PropertyForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Salvar',
}: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  })

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Título
        </label>
        <Input id="title" {...register('title')} error={errors.title?.message} />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="description"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="type" className="text-sm font-medium">
            Tipo
          </label>
          <select
            id="type"
            {...register('type')}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {PROPERTY_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

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

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  )
}
