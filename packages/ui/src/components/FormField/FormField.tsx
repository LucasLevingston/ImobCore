'use client'

import { Controller, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form'
import { FormFieldContext } from './form-field-context'

// DIP: FormField é um wrapper fino sobre Controller — nunca sabe qual input concreto
// será renderizado dentro de `render`. Só expõe `fieldState.error` via contexto pros
// irmãos (FormLabel/FormControl/FormMessage) não precisarem repetir o acesso.
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ render, ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={(controllerRenderProps) => (
        <FormFieldContext.Provider
          value={{
            name: props.name,
            error: controllerRenderProps.fieldState.error,
          }}
        >
          {render(controllerRenderProps)}
        </FormFieldContext.Provider>
      )}
    />
  )
}
