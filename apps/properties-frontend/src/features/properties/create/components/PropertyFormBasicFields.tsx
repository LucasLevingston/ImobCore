import { Input } from '@microfrontends/ui'
import type { PropertyFormFieldsProps } from './PropertyForm.types'

export function PropertyFormBasicFields({ register, errors }: PropertyFormFieldsProps) {
  return (
    <>
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
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background transition-colors duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>
    </>
  )
}
