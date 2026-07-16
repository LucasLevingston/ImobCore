import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import {
  Controller,
  type ControllerProps,
  type FieldError,
  type FieldPath,
  type FieldValues,
  FormProvider,
} from 'react-hook-form'
import { cn } from '../../lib/utils'

// Alias ergonômico — mesmo componente de react-hook-form, só renomeado
// pra combinar com o resto do design system (Form, FormField, FormItem...).
export const Form = FormProvider

interface FormFieldContextValue {
  name: string
  error: FieldError | undefined
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function useFormFieldContext(): FormFieldContextValue {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error('FormLabel/FormControl/FormMessage precisam estar dentro de um <FormField>')
  }
  return context
}

interface FormItemContextValue {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

function useFormItemContext(): FormItemContextValue {
  const context = React.useContext(FormItemContext)
  if (!context) {
    throw new Error('FormLabel/FormControl/FormMessage precisam estar dentro de um <FormItem>')
  }
  return context
}

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

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    )
  },
)
FormItem.displayName = 'FormItem'

export const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { id } = useFormItemContext()
  const { error } = useFormFieldContext()
  return (
    <label
      ref={ref}
      htmlFor={`${id}-control`}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-destructive',
        className,
      )}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

// Slot repassa id/aria-* pro input real renderizado como único filho (Input, Select, etc.)
// — FormControl nunca sabe qual elemento de fato recebe esses atributos (OCP via composição).
export const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>((props, ref) => {
  const { id } = useFormItemContext()
  const { error } = useFormFieldContext()
  const describedBy = error ? `${id}-message` : undefined

  return (
    <Slot
      ref={ref}
      id={`${id}-control`}
      aria-invalid={!!error}
      aria-describedby={describedBy}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { id } = useFormItemContext()
  const { error } = useFormFieldContext()
  const content = error?.message ?? children

  if (!content) {
    return null
  }

  return (
    <p
      ref={ref}
      id={`${id}-message`}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {content}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'
