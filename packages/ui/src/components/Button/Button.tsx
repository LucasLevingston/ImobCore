import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'
import { buttonVariants } from './Button.variants'
import type { ButtonProps } from './Button.types'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText = 'Carregando...',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    // React 19 ampliou ReactNode pra incluir bigint; a tipagem do Slot (Radix)
    // ainda não acompanhou isso, então o union Slot|'button' força o TS a
    // interseccionar os dois tipos de children e falha nesse caso específico
    // — ElementType é o tipo genérico correto pra um componente escolhido em
    // runtime, sem essa interseção espúria (bigint nunca é passado de verdade aqui)
    const Comp: React.ElementType = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading ? loadingText : children}
      </Comp>
    )
  },
)

Button.displayName = 'Button'
