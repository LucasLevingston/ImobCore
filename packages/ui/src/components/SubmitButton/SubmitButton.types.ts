import type { ButtonProps } from '../Button'

// SRP: só fixa a semântica de "botão de submit" — reusa 100% da lógica de
// disable/spinner/loadingText que Button.isLoading já implementa, sem
// duplicá-la. O consumidor decide de onde vem isLoading (form.formState
// .isSubmitting, mutation.isPending, etc.) — sem mágica de contexto
// implícita, mantém o dado explícito e testável.
export type SubmitButtonProps = Omit<ButtonProps, 'type'>
